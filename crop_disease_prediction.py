# =============================================================================
# Crop Disease Prediction
# =============================================================================
# Converted from Jupyter Notebook for use in VS Code
# =============================================================================

# %% [Section 1] Imports & Environment Check
import os
import random
import cv2
import numpy as np
import pandas as pd
import timm
import torchmetrics
from glob import glob
from PIL import Image
from torch.utils.data import random_split, Dataset, DataLoader
from torchvision import transforms as T
from tqdm import tqdm

# List all input files (update path as needed for local use)
DATA_ROOT = r"X:\Major_project_plant\Crop Diseases"  # Updated to the discovered dataset path

for dirname, _, filenames in os.walk(DATA_ROOT):
    for filename in filenames:
        print(os.path.join(dirname, filename))


# %% [Section 2] Dataset & DataLoader Setup
import torch
import shutil

torch.manual_seed(2024)


class CustomDataset(Dataset):

    def __init__(self, root, transformations=None):
        self.transformations = transformations
        self.im_paths = sorted(glob(f"{root}/*/*"))

        self.cls_names, self.cls_counts, count = {}, {}, 0
        for im_path in self.im_paths:
            class_name = self.get_class(im_path)
            if class_name not in self.cls_names:
                self.cls_names[class_name] = count
                self.cls_counts[class_name] = 1
                count += 1
            else:
                self.cls_counts[class_name] += 1

    def get_class(self, path):
        return os.path.dirname(path).split("/")[-1]

    def __len__(self):
        return len(self.im_paths)

    def __getitem__(self, idx):
        im_path = self.im_paths[idx]
        im = Image.open(im_path).convert("RGB")
        gt = self.cls_names[self.get_class(im_path)]
        if self.transformations is not None:
            im = self.transformations(im)
        return im, gt


def get_dls(root, transformations, bs, split=[0.9, 0.05, 0.05], ns=4):
    ds = CustomDataset(root=root, transformations=transformations)

    total_len = len(ds)
    tr_len = int(total_len * split[0])
    vl_len = int(total_len * split[1])
    ts_len = total_len - (tr_len + vl_len)

    tr_ds, vl_ds, ts_ds = random_split(dataset=ds, lengths=[tr_len, vl_len, ts_len])

    tr_dl  = DataLoader(tr_ds, batch_size=bs, shuffle=True,  num_workers=ns)
    val_dl = DataLoader(vl_ds, batch_size=bs, shuffle=False, num_workers=ns)
    ts_dl  = DataLoader(ts_ds, batch_size=1,  shuffle=False, num_workers=ns)

    return tr_dl, val_dl, ts_dl, ds.cls_names


mean, std, im_size = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225], 224
tfs = T.Compose([
    T.Resize((im_size, im_size)),
    T.ToTensor(),
    T.Normalize(mean=mean, std=std)
])

tr_dl, val_dl, ts_dl, classes = get_dls(root=DATA_ROOT, transformations=tfs, bs=32)

print(f"Train batches      : {len(tr_dl)}")
print(f"Validation batches : {len(val_dl)}")
print(f"Test batches       : {len(ts_dl)}")
print(f"Classes            : {classes}")


# %% [Section 3] Visualization Utilities
from matplotlib import pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend


def tensor_2_im(t, t_type="rgb"):
    gray_tfs = T.Compose([
        T.Normalize(mean=[0.], std=[1 / 0.5]),
        T.Normalize(mean=[-0.5], std=[1])
    ])
    rgb_tfs = T.Compose([
        T.Normalize(mean=[0., 0., 0.], std=[1 / 0.229, 1 / 0.224, 1 / 0.225]),
        T.Normalize(mean=[-0.485, -0.456, -0.406], std=[1., 1., 1.])
    ])
    invTrans = gray_tfs if t_type == "gray" else rgb_tfs

    if t_type == "gray":
        return (invTrans(t) * 255).detach().squeeze().cpu().permute(1, 2, 0).numpy().astype(np.uint8)
    else:
        return (invTrans(t) * 255).detach().cpu().permute(1, 2, 0).numpy().astype(np.uint8)


def visualize(data, n_ims, rows, cmap=None, cls_names=None):
    assert cmap in ["rgb", "gray"], "Please specify 'rgb' or 'gray' for cmap!"
    cmap_plot = "viridis" if cmap == "rgb" else "gray"

    plt.figure(figsize=(20, 10))
    indices = [random.randint(0, len(data) - 1) for _ in range(n_ims)]
    for idx, indeks in enumerate(indices):
        im, gt = data[indeks]
        plt.subplot(rows, n_ims // rows, idx + 1)
        plt.imshow(tensor_2_im(im, cmap), cmap=cmap_plot)
        plt.axis("off")
        title = cls_names[int(gt)] if cls_names is not None else str(gt)
        plt.title(f"GT -> {title}")
    plt.tight_layout()
    plt.savefig('visualization_samples.png', dpi=100, bbox_inches='tight')
    plt.close()


# Visualize samples from each split
print("Saving visualization of training samples...")
visualize(tr_dl.dataset,  n_ims=20, rows=4, cmap="rgb", cls_names=list(classes.keys()))
print("Saving visualization of validation samples...")
visualize(val_dl.dataset, n_ims=20, rows=4, cmap="rgb", cls_names=list(classes.keys()))
print("Saving visualization of test samples...")
visualize(ts_dl.dataset,  n_ims=20, rows=4, cmap="rgb", cls_names=list(classes.keys()))


# %% [Section 4] Dataset Analysis (Class Distribution)
def data_analysis(root, transformations):
    ds = CustomDataset(root=root, transformations=transformations)
    cls_counts = ds.cls_counts
    width, text_width, text_height = 0.7, 0.05, 2

    cls_names = list(cls_counts.keys())
    counts = list(cls_counts.values())

    fig, ax = plt.subplots(figsize=(20, 10))
    indices = np.arange(len(counts))

    ax.bar(indices, counts, width, color="firebrick")
    ax.set_xlabel("Class Names", color="red")
    ax.set_ylabel("Data Counts", color="red")
    ax.set_title("Dataset Class Imbalance Analysis")
    ax.set(xticks=indices, xticklabels=cls_names)
    ax.set_xticklabels(cls_names, rotation=60)

    for i, v in enumerate(counts):
        ax.text(i - text_width, v + text_height, str(v), color="royalblue")

    plt.tight_layout()
    plt.savefig('class_distribution.png', dpi=100, bbox_inches='tight')
    plt.close()


print("Analyzing dataset class distribution...")
data_analysis(root=DATA_ROOT, transformations=tfs)


# %% [Section 5] Model Setup

# Load pretrained RexNet model (architecture check)
model_check = timm.create_model("rexnet_150", pretrained=True)
print("Model loaded successfully.")


# %% [Section 6] Training

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
SAVE_DIR = "saved_models"
SAVE_PREFIX = "crop"

m = timm.create_model("rexnet_150", pretrained=True, num_classes=len(classes))
m = m.to(DEVICE)

loss_fn   = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(params=m.parameters(), lr=3e-4)
f1_score  = torchmetrics.F1Score(task="multiclass", num_classes=len(classes)).to(DEVICE)

epochs = 10
best_loss, threshold, not_improved, patience = float("inf"), 0.01, 0, 5

tr_losses,  val_losses  = [], []
tr_accs,    val_accs    = [], []
tr_f1s,     val_f1s     = [], []


def to_device(batch, device):
    return batch[0].to(device), batch[1].to(device)


def get_metrics(model, ims, gts, loss_fn, epoch_loss, epoch_acc, epoch_f1):
    preds = model(ims)
    loss  = loss_fn(preds, gts)
    return (
        loss,
        epoch_loss + loss.item(),
        epoch_acc  + (torch.argmax(preds, dim=1) == gts).sum().item(),
        epoch_f1   + f1_score(preds, gts)
    )


print("Starting training...")
for epoch in range(epochs):

    m.train()
    epoch_loss, epoch_acc, epoch_f1 = 0, 0, 0

    for batch in tqdm(tr_dl, desc=f"Epoch {epoch + 1}/{epochs} [Train]"):
        ims, gts = to_device(batch, DEVICE)
        loss, epoch_loss, epoch_acc, epoch_f1 = get_metrics(
            m, ims, gts, loss_fn, epoch_loss, epoch_acc, epoch_f1
        )
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    tr_loss = epoch_loss / len(tr_dl)
    tr_acc  = epoch_acc  / len(tr_dl.dataset)
    tr_f1   = epoch_f1   / len(tr_dl)
    tr_losses.append(tr_loss); tr_accs.append(tr_acc); tr_f1s.append(tr_f1)

    print(f"  Train  | Loss: {tr_loss:.3f} | Acc: {tr_acc:.3f} | F1: {tr_f1:.3f}")

    m.eval()
    with torch.no_grad():
        val_loss_sum, val_acc_sum, val_f1_sum = 0, 0, 0
        for batch in val_dl:
            ims, gts = to_device(batch, DEVICE)
            _, val_loss_sum, val_acc_sum, val_f1_sum = get_metrics(
                m, ims, gts, loss_fn, val_loss_sum, val_acc_sum, val_f1_sum
            )

        val_loss = val_loss_sum / len(val_dl)
        val_acc  = val_acc_sum  / len(val_dl.dataset)
        val_f1   = val_f1_sum   / len(val_dl)
        val_losses.append(val_loss); val_accs.append(val_acc); val_f1s.append(val_f1)

        print(f"  Val    | Loss: {val_loss:.3f} | Acc: {val_acc:.3f} | F1: {val_f1:.3f}")

        if val_loss < (best_loss + threshold):
            os.makedirs(SAVE_DIR, exist_ok=True)
            best_loss = val_loss
            torch.save(m.state_dict(), f"{SAVE_DIR}/{SAVE_PREFIX}_best_model.pth")
            print("  ✔ Model saved.")
        else:
            not_improved += 1
            print(f"  No improvement for {not_improved} epoch(s).")
            if not_improved == patience:
                print(f"Early stopping after {patience} epochs without improvement.")
                break


# %% [Section 7] Learning Curves
class PlotLearningCurves:

    def __init__(self, tr_losses, val_losses, tr_accs, val_accs, tr_f1s, val_f1s):
        self.tr_losses  = tr_losses;  self.val_losses = val_losses
        self.tr_accs    = tr_accs;    self.val_accs   = val_accs
        self.tr_f1s     = tr_f1s;     self.val_f1s    = val_f1s

    def _plot(self, arr1, arr2, lbl1, lbl2, c1, c2):
        plt.plot(arr1, label=lbl1, c=c1)
        plt.plot(arr2, label=lbl2, c=c2)

    def _decorate(self, ylabel, n):
        plt.xlabel("Epochs")
        plt.ylabel(ylabel)
        plt.xticks(ticks=np.arange(n), labels=list(range(1, n + 1)))
        plt.legend()
        plt.tight_layout()
        plt.show()

    def visualize(self):
        n = len(self.tr_accs)

        plt.figure(figsize=(10, 5))
        self._plot(self.tr_losses, self.val_losses, "Train Loss", "Val Loss", "red", "blue")
        self._decorate("Loss Values", n)
        plt.savefig('learning_curve_loss.png', dpi=100, bbox_inches='tight')
        plt.close()

        plt.figure(figsize=(10, 5))
        self._plot(self.tr_accs, self.val_accs, "Train Accuracy", "Val Accuracy", "orangered", "darkgreen")
        self._decorate("Accuracy Scores", n)
        plt.savefig('learning_curve_accuracy.png', dpi=100, bbox_inches='tight')
        plt.close()

        plt.figure(figsize=(10, 5))
        self._plot(
            [f.cpu() for f in self.tr_f1s],
            [f.cpu() for f in self.val_f1s],
            "Train F1", "Val F1", "blueviolet", "crimson"
        )
        self._decorate("F1 Scores", n)
        plt.savefig('learning_curve_f1.png', dpi=100, bbox_inches='tight')
        plt.close()


print("Generating learning curve plots...")
PlotLearningCurves(tr_losses, val_losses, tr_accs, val_accs, tr_f1s, val_f1s).visualize()


# %% [Section 8] Inference with GradCAM


class SaveFeatures:
    """Hooks into a conv layer and captures its output activations."""
    features = None

    def __init__(self, m):
        self.hook = m.register_forward_hook(self.hook_fn)

    def hook_fn(self, module, input, output):
        self.features = output.cpu().data.numpy()

    def remove(self):
        self.hook.remove()


def getCAM(conv_fs, linear_weights, class_idx):
    bs, chs, h, w = conv_fs.shape
    cam = linear_weights[class_idx].dot(conv_fs[0, :, :, :].reshape((chs, h * w)))
    cam = cam.reshape(h, w)
    return (cam - np.min(cam)) / np.max(cam)


def inference(model, device, test_dl, num_ims, row, final_conv, fc_params, cls_names=None):
    weight = np.squeeze(fc_params[0].cpu().data.numpy())
    activated_features = SaveFeatures(final_conv)

    preds, images, lbls, acc = [], [], [], 0

    for batch in tqdm(test_dl, desc="Inference"):
        im, gt = to_device(batch, device)
        pred_class = torch.argmax(model(im), dim=1)
        acc += (pred_class == gt).sum().item()
        images.append(im)
        preds.append(pred_class.item())
        lbls.append(gt.item())

    print(f"Test Accuracy: {(acc / len(test_dl.dataset)):.3f}")

    plt.figure(figsize=(20, 10))
    indices = [random.randint(0, len(images) - 1) for _ in range(num_ims)]

    for idx, indeks in enumerate(indices):
        im = images[indeks].squeeze()
        pred_idx = preds[indeks]
        heatmap = getCAM(activated_features.features, weight, pred_idx)

        plt.subplot(row, num_ims // row, idx + 1)
        plt.imshow(tensor_2_im(im), cmap="gray")
        plt.axis("off")
        plt.imshow(
            cv2.resize(heatmap, (im_size, im_size), interpolation=cv2.INTER_LINEAR),
            alpha=0.4, cmap="jet"
        )
        plt.axis("off")

        if cls_names:
            gt_name   = cls_names[int(lbls[indeks])]
            pred_name = cls_names[int(preds[indeks])]
            color     = "green" if gt_name == pred_name else "red"
            plt.title(f"GT: {gt_name}\nPRED: {pred_name}", color=color, fontsize=8)

    plt.tight_layout()
    plt.savefig('inference_gradcam.png', dpi=100, bbox_inches='tight')
    plt.close()


# Load best model and run inference
m.load_state_dict(torch.load(f"{SAVE_DIR}/{SAVE_PREFIX}_best_model.pth", map_location=DEVICE))
m.eval()

final_conv = m.features[-1]
fc_params  = list(m.head.fc.parameters())

print("Running inference with GradCAM visualization...")
inference(
    model=m.to(DEVICE),
    device=DEVICE,
    test_dl=ts_dl,
    num_ims=20,
    row=4,
    cls_names=list(classes.keys()),
    final_conv=final_conv,
    fc_params=fc_params
)

print("\n" + "=" * 80)
print("PROJECT COMPLETED SUCCESSFULLY!")
print("=" * 80)
print("Generated files:")
print("  - visualization_samples.png: Sample images from dataset")
print("  - class_distribution.png: Class imbalance analysis")
print("  - learning_curve_loss.png: Training vs validation loss")
print("  - learning_curve_accuracy.png: Training vs validation accuracy")
print("  - learning_curve_f1.png: Training vs validation F1 scores")
print("  - inference_gradcam.png: GradCAM inference visualization")
print("  - saved_models/crop_best_model.pth: Best trained model weights")
print("=" * 80)

import torch
from torchvision import models, transforms
from PIL import Image

def get_transform():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),
    ])

def load_model():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.eval()
    return model

def classify_image(image_path, model=None):
    if model is None:
        model = load_model()
    image = Image.open(image_path).convert("RGB")
    tensor = get_transform()(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(tensor)
    _, predicted = torch.max(outputs, 1)
    return int(predicted.item())

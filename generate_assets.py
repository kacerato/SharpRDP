from PIL import Image

def create_image(filename, width, height, color):
    img = Image.new('RGB', (width, height), color=color)
    img.save(filename)

create_image('devoted-mind/assets/icon.png', 1024, 1024, 'red')
create_image('devoted-mind/assets/splash.png', 1242, 2436, 'black')
create_image('devoted-mind/assets/adaptive-icon.png', 1024, 1024, 'blue')
create_image('devoted-mind/assets/favicon.png', 48, 48, 'green')

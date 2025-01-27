import pygame


def load_image(path):
    """Load an image from the assets folder."""
    return pygame.image.load(path)


def play_sound(path):
    """Play a sound from the assets folder."""
    sound = pygame.mixer.Sound(path)
    sound.play()


def check_bounds(position, screen_width, screen_height):
    """Ensure the entity stays within the screen bounds."""
    x, y = position
    x = max(0, min(x, screen_width))
    y = max(0, min(y, screen_height))
    return [x, y]

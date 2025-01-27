import random

import pygame
from constants import PACMAN_COLOR, PACMAN_SPEED


class Pacman:
    def __init__(self, position):
        self.position = position
        self.speed = PACMAN_SPEED
        self.color = PACMAN_COLOR
        self.rect = pygame.Rect(self.position[0], self.position[1], 20, 20)

    def move(self, game_obj):
        direction_dict = game_obj.game_map.get_direction_dict(self.position, self.speed)
        next_move = direction_dict[game_obj.direction]
        next_rect = pygame.Rect(next_move[0], next_move[1], 20, 20)
        if not game_obj.game_map.check_collision(next_rect):
            self.position = next_move
            self.rect.topleft = self.position

        else:
            for direction, position in direction_dict.items():
                    next_rect = pygame.Rect(position[0], position[1], 20, 20)
                    if not game_obj.game_map.check_collision(next_rect):
                        self.position = position
                        self.rect.topleft = self.position
                        game_obj.direction = direction
                        break
                    else:
                        print('direction', direction)
                        print(next_rect)

        self.rect.topleft = self.position

    def draw(self, screen):
        pygame.draw.circle(screen, self.color, self.rect.center, 20)

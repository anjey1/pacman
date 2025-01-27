import random
import time

import pygame
from constants import GHOST_COLOR, GHOST_SPEED, SCREEN_WIDTH, SCREEN_HEIGHT, ESCAPE_TIME


class Ghost:
    def __init__(self, position):
        self.position = position
        self.speed = GHOST_SPEED
        self.color = GHOST_COLOR
        self.rect = pygame.Rect(self.position[0], self.position[1], 20, 20)
        self.direction = 'RIGHT'
        self.pacman_collision_time = time.time()

     #TODO: there are safe zons from ghosts
    def move(self, game_obj):
        game_map = game_obj.game_map
        direction_dict = game_map.get_direction_dict(self.position, self.speed)
        next_move = direction_dict[self.direction]
        next_rect = pygame.Rect(next_move[0], next_move[1], 20, 20)
        if not game_map.check_collision(next_rect):
            self.position = next_move
            self.rect.topleft = self.position

        else:
            good_direction = False
            while not good_direction:
                direction = random.choice(list(direction_dict.keys()))
                if direction != self.direction:
                    position = direction_dict[direction]
                    next_rect = pygame.Rect(position[0], position[1], 20, 20)
                    if not game_map.check_collision(next_rect):
                        self.position = position
                        self.rect.topleft = self.position
                        self.direction = direction
                        good_direction = True
        self.check_pacman_collision(game_obj)

    def check_pacman_collision(self, game_obj):
        current_time = time.time()
        if (current_time - self.pacman_collision_time) > ESCAPE_TIME:
            if self.rect.colliderect(game_obj.pacman.rect):
                game_obj.life -= 1
                self.pacman_collision_time = time.time()
                # render red square if life is subtracted
                red_square_size = 50
                red_square_color = (255, 0, 0)
                red_square_position = (
                    SCREEN_WIDTH // 2 - red_square_size // 2,
                    SCREEN_HEIGHT // 2 // 2 + 20  #
                )
                pygame.draw.rect(game_obj.screen, red_square_color, pygame.Rect(
                    red_square_position[0], red_square_position[1], red_square_size, red_square_size))

                pygame.display.flip()
                time.sleep(0.3)
    def draw(self, screen):
        pygame.draw.circle(screen, self.color, self.rect.center, 20)
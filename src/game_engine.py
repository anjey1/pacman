import time

import pygame
from pacman import Pacman
from ghost import Ghost
from game_map import GameMap
from constants import SCREEN_WIDTH, SCREEN_HEIGHT, LIVE_NUM


class GameEngine:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Pacman Game")
        self.clock = pygame.time.Clock()
        self.pacman = Pacman([40, 40])
        # self.ghosts = [Ghost([100, 40]), Ghost([400, 40])]
        self.ghosts = [Ghost([400, 40])]
        self.game_map = GameMap()
        self.running = True
        self.direction = "DOWN"  # Store the direction for continuous movement
        self.life = LIVE_NUM
        self.game_state = [self.pacman, self.ghosts]

    def run(self):
        while self.running:
            self.handle_events()
            self.update_game_state()
            self.render()
            self.clock.tick(30)  # Limit to 30 frames per second

            if len(self.game_map.food) == 0:
                self.running = False  # End game when all food is eaten
                print("You won!")

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.running = False
                if event.key == pygame.K_UP:
                    self.direction = "UP"
                elif event.key == pygame.K_DOWN:
                    self.direction = "DOWN"
                elif event.key == pygame.K_LEFT:
                    self.direction = "LEFT"
                elif event.key == pygame.K_RIGHT:
                    self.direction = "RIGHT"

    def handle_input(self, action):
        if action == "UP":
            self.player.y -= 5
        elif action == "DOWN":
            self.player.y += 5
        elif action == "LEFT":
            self.player.x -= 5
        elif action == "RIGHT":
            self.player.x += 5
        elif action == "CLICK":
            print("Mouse click received!")

    def update_game_state(self):

        if self.direction:
            self.pacman.move(self)

        for ghost in self.ghosts:
            ghost.move(self)

        self.game_state[0] = self.pacman.position
        self.game_state[1] = self.ghosts[0].position

        if self.life < 1:
            font = pygame.font.Font(None, 74)
            text = font.render("Nice Try, Try Harder", True, (255, 0, 0))
            self.screen.blit(
                text,
                (
                    SCREEN_WIDTH // 2 - text.get_width() // 2,
                    SCREEN_HEIGHT // 2 - text.get_height() // 2,
                ),
            )
            pygame.display.flip()
            time.sleep(2)
            self.restart_game()

    def render(self):
        self.screen.fill((0, 0, 0))  # Clear the screen
        self.game_map.draw(self.screen)
        self.pacman.draw(self.screen)
        for ghost in self.ghosts:  # Render ghosts
            ghost.draw(self.screen)
        pygame.display.flip()

    def restart_game(self):
        self.pacman = Pacman([40, 40])
        self.ghosts = [Ghost([100, 40]), Ghost([400, 40])]
        self.game_map = GameMap()
        self.direction = None
        self.life = LIVE_NUM

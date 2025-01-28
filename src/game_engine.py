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
        self.game_start_time = pygame.time.get_ticks()
        self.pacman = Pacman([40, 40])
        self.ghosts = [Ghost([300, 330]), Ghost([300, 330]), Ghost([300, 330])]
        self.game_map = GameMap()
        self.running = True
        self.direction = "DOWN"  # Store the direction for continuous movement
        self.life = LIVE_NUM

        # Initialize positions and state

        self.game_state = {
            "positions": {
                "pacman": [100, 100],  # Pac-Man position [x, y]
                "ghosts": [
                    [200, 200],  # Ghost 1 position [x, y]
                    [300, 300],  # Ghost 2 position [x, y]
                    # Add more ghosts if needed
                ],
            },
            "state": {
                "score": 0,  # Score based on elapsed time
                "lives": 3,  # Number of lives left
                "game_over": False,  # Whether the game is over or not
            },
        }

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

    def update_game_state(self):

        if self.direction:
            self.pacman.move(self)

        for ghost in self.ghosts:
            ghost.move(self)

        self.game_state["positions"]["pacman"] = self.pacman.position
        # self.game_state["positions"]["ghosts"] = self.ghosts[0].position
        self.game_state["positions"]["ghosts"] = [
            ghost.position for ghost in self.ghosts
        ]

        self.game_state["state"]["score"] = int(
            (pygame.time.get_ticks() - self.game_start_time) / 1000
        )

        self.game_state["state"]["lives"] = self.life

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
            self.game_state["state"]["game_over"] = True
            pygame.display.flip()
            time.sleep(2)
            self.game_state["state"]["game_over"] = False
            self.game_start_time = pygame.time.get_ticks()
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
        self.ghosts = [Ghost([300, 330]), Ghost([300, 330]), Ghost([300, 330])]
        self.game_map = GameMap()
        self.direction = None
        self.life = LIVE_NUM

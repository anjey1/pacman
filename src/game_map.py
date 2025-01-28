import pygame
from constants import WALL_COLOR, FOOD_COLOR, TILE_SIZE


class GameMap:
    def __init__(self):
        self.map_data = [
            "#######################",
            "#.#.................#.#",
            "#.###.#####.#####.###.#",
            "#.........#.#.........#",
            "#.###.###.#.#.###.###.#",
            "#.#.#.#.#.#.#.#.#.#.#.#",
            "###.#.#.#.#.#.#.#.#.###",
            "#...#.#.###.###.#.#...#",
            "#.###.#.........#.###.#",
            "#.....#.######..#.....#",
            "#.#####.#....#..#####.#",
            "#.....................#",
            "#.#####.#....#..#####.#",
            "#.....#.######..#.....#",
            "#.###.#.........#.###.#",
            "#.#.#.#.###.###.#.#.#.#",
            "#.#.#.#.#.#.#.#.#.#.#.#",
            "#...#.#.#.#.#.#.#.#...#",
            "###.#.#.#.#.#.#.#.#.###",
            "#.###.###.#.#.###.###.#",
            "#.........#.#.........#",
            "#.###.#####.#####.###.#",
            "#.#.................#.#",
            "#######################",
        ]
        self.walls = []
        self.food = []

        self.build_map()

    def build_map(self):
        for y, row in enumerate(self.map_data):
            for x, tile in enumerate(row):
                if tile == "#":
                    self.walls.append(
                        pygame.Rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                    )
                elif tile == ".":
                    self.food.append(
                        pygame.Rect(
                            x * TILE_SIZE + TILE_SIZE // 2,
                            y * TILE_SIZE + TILE_SIZE // 2,
                            5,
                            5,
                        )
                    )

    def draw(self, screen):
        for wall in self.walls:
            pygame.draw.rect(screen, WALL_COLOR, wall)
        for food in self.food:
            pygame.draw.rect(screen, FOOD_COLOR, food)

    def check_collision(self, entity_rect):
        for wall in self.walls:
            if entity_rect.colliderect(wall):
                print(f"wall collided: {wall}")
                return True
        return False

    def check_food_collision(self, entity_rect):
        for food in self.food:
            if entity_rect.colliderect(food):
                self.food.remove(food)
                return True
        return False

    @staticmethod
    def get_direction_dict(position: list[int, int], speed: int) -> dict:
        return {
            "LEFT": [position[0] - speed, position[1]],
            "RIGHT": [position[0] + speed, position[1]],
            "UP": [position[0], position[1] - speed],
            "DOWN": [position[0], position[1] + speed],
        }

import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// Create Match Endpoint
export const createMatch = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const match = await prisma.match.create({
      data: {
        status: "waiting",
        currentRound: 0,
        maxPlayers: 4
      }
    });

    await prisma.matchPlayer.create({
      data: {
        matchId: match.id,
        userId: req.userId!
      }
    });

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create match"
    });
  }
};

//Join Match Endpoint
export const joinMatch = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const matchId = req.params.id as string;

    const match = await prisma.match.findUnique({
      where: {
        id: matchId
      }
    });

    if (!match) {
      res.status(404).json({
        message: "Match not found"
      });
      return;
    }

    const alreadyJoined = await prisma.matchPlayer.findFirst({
      where: {
        matchId,
        userId: req.userId!
      }
    });

    if (alreadyJoined) {
      res.status(400).json({
        message: "Already joined this match"
      });
      return;
    }

    const existingPlayers = await prisma.matchPlayer.count({
      where: {
        matchId
      }
    });

    if (existingPlayers >= match.maxPlayers) {
      res.status(400).json({
        message: "Match full"
      });
      return;
    }

    const player = await prisma.matchPlayer.create({
      data: {
        matchId,
        userId: req.userId!
      }
    });

    res.status(201).json(player);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to join match"
    });
  }
};
//Get Match Endpoint
export const getMatch = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const matchId = req.params.id as string;

    const match = await prisma.match.findUnique({
      where: {
        id: matchId
      },
      include: {
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!match) {
      res.status(404).json({
        message: "Match not found"
      });
      return;
    }

    res.json(match);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch match"
    });
  }
};

//-------------------------
//Start Match Endpoint
//-------------------------

export const startMatch = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const matchId = req.params.id as string;

    const match = await prisma.match.findUnique({
      where: {
        id: matchId
      },
      include: {
        players: true
      }
    });

    if (!match) {
      res.status(404).json({
        message: "Match not found"
      });
      return;
    }

    if (match.players.length < 2) {
      res.status(400).json({
        message: "Need at least 2 players"
      });
      return;
    }

    if (match.status === "active") {
      res.status(400).json({
        message: "Match already started"
      });
      return;
    }

    // =========================
    // Initialize Resources + AP
    // =========================

    for (const player of match.players) {
      const existingResource =
        await prisma.playerResource.findUnique({
          where: {
            playerId: player.id
          }
        });

      if (!existingResource) {
        await prisma.playerResource.create({
          data: {
            playerId: player.id,
            gold: 100,
            food: 100,
            iron: 50,
            influence: 10
          }
        });
      }

      const existingAp =
        await prisma.playerActionPoints.findUnique({
          where: {
            playerId: player.id
          }
        });

      if (!existingAp) {
        await prisma.playerActionPoints.create({
          data: {
            playerId: player.id,
            currentAp: 3,
            maxAp: 6
          }
        });
      }
    }

    // =========================
    // Get Capitals
    // =========================

    const capitals = await prisma.region.findMany({
      where: {
        regionType: "CAPITAL"
      }
    });

    if (capitals.length < match.players.length) {
      res.status(400).json({
        message: "Not enough capitals available"
      });
      return;
    }

    // =========================
    // Shuffle Capitals
    // =========================

    const shuffledCapitals = [...capitals].sort(
      () => Math.random() - 0.5
    );

    // =========================
    // Assign Capitals
    // =========================

    for (let i = 0; i < match.players.length; i++) {
      const player = match.players[i];
      const capital = shuffledCapitals[i];

      const existingOwnership =
        await prisma.regionOwnership.findUnique({
          where: {
            regionId: capital.id
          }
        });

      if (!existingOwnership) {
        await prisma.regionOwnership.create({
          data: {
            regionId: capital.id,
            playerId: player.id,
            isCapital: true
          }
        });
      }
    }

    // =========================
    // Activate Match
    // =========================

    const updatedMatch = await prisma.match.update({
      where: {
        id: matchId
      },
      data: {
        status: "active",
        currentRound: 1
      }
    });

    res.json(updatedMatch);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to start match"
    });
  }
};
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

//Start Match Endpoint
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
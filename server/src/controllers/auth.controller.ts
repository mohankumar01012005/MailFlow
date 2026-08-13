import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/auth.service.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function signupController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const data = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      ...data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register account.";

    return res.status(400).json({
      success: false,
      message,
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const data = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      ...data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to log in.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
}

export async function getMeController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    const user = await getUserProfile(req.user.userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
}

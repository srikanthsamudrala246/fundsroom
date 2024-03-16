import express from 'express';
import { fetchUser } from '../middlewares/user';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { prisma } from '../db';

const router = express.Router();
dotenv.config();


router.put('/makePayment', fetchUser, async(req, res) => {
    const id = req.body['user'].id;
    let success = false;
    const amount = req.body.amount;
    try {
       await prisma.user.update({
            data: {
                due: {
                    increment: amount
                },
                limit:{
                    decrement: amount
                }
            },
            where: {
                userId: id
            }
        });
        success =true;
        return res.json({success, message: "Payment successful..."});
    } catch (error) {
        success = false;
        res.status(400).json({success, error: "Please validate using a valid AuthToken..."})
    }
})

router.get('/generateBill',fetchUser, async(req, res) => {
    const id = req.body['user'].id;
    let success = true;
    try {
        const userDetails = await prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                due: true
            }
        })
        if(!userDetails){
            success = false;
            res.status(400).json({success, error: "Invalid Authorization..."})
        }
        const dueAmount = userDetails?.due;
        success = true;
        return res.json({success, dueAmount});
    } catch (error) {
        success = false;
        return res.status(400).json({success, error: "Internal server error..."});
    }
});

router.get('/fetchLimit', fetchUser, async(req, res) => {
    const id = req.body['user'].id;
    let success = false;
    try {
        const userDetails = await prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                limit: true
            }
        });
        if(!userDetails){
            return res.status(400).json({success, error: "Unauthorized access..."});
        };
        success = true;
        return res.json({success, limit: userDetails.limit});
    } catch (error) {
        success = false;
        return res.status(500).json({success, error: "Internal server error..."});
    }
    
})

router.put('/payPending',fetchUser, async(req, res) => {
    const id = req.body['user'].id;
    let success = false;
    try {
        const userDetails = await prisma.user.findUnique({
            where: {
                userId: id
            },
            select: {
                due: true
            }
        });
    
        if(!userDetails){
            res.status(400).json({success, error: "Invalid Authorization..."});
        }
        const dueAmount = userDetails?.due;
    
        await prisma.user.update({
            data: {
                due: {
                    decrement: dueAmount,
                },
                limit: {
                    increment: dueAmount
                }
            },
            where: {
                userId: id
            }
        });
        success = true;
        return res.json({success, message: "Payment successful..."});
    } catch (error) {
        success = false;
        return res.status(500).json({success, error: "Internal server error..."});
    }
})

module.exports = router;
import express from 'express';
import { getNumber, getCode, denyNumber, finishNumber } from '../controllers/smsController.js';

export default function(smsService) {
  const router = express.Router();

  router.post('/getNumber', (req, res) => getNumber(req, res, smsService));
  router.post('/getCode', (req, res) => getCode(req, res, smsService));
  router.post('/denyNumber', (req, res) => denyNumber(req, res, smsService));
  router.post('/finishNumber', (req, res) => finishNumber(req, res, smsService));

  return router;
}

import { getLogger } from '../utils/logger.js';
const logger = await getLogger();


export async function getNumber(req, res, smsService) {
  try {
    const { id, number, operator } = await smsService.getNumber();
    logger.info(`Fetched number: ${number} (Operator: ${operator}, ID: ${id})`);
    res.json({ id, number, operator });
  } catch (error) {
    logger.error(`Error in getNumber: ${error.message}`);
    res.status(500).json({ error: 'Failed to get number' });
  }
}

export async function getCode(req, res, smsService) {
  const { phoneId } = req.body;
  if (!phoneId) {
    logger.warn('Missing phoneId in getCode request');
    return res.status(400).json({ error: 'phoneId is required' });
  }

  try {
    const smsCode = await smsService.getCode(phoneId);
    if (!smsCode) {
      logger.warn(`No SMS code found for phoneId ${phoneId}`);
      return res.status(404).json({ error: 'SMS code not found' });
    }
    logger.info(`Fetched SMS code for phoneId ${phoneId}`);
    res.json({ smsCode });
  } catch (error) {
    logger.error(`Error in getCode for phoneId ${phoneId}: ${error.message}`);
    res.status(500).json({ error: 'Failed to get SMS code' });
  }
}

export async function denyNumber(req, res, smsService) {
  const { phoneId } = req.body;
  if (!phoneId) {
    logger.warn('Missing phoneId in denyNumber request');
    return res.status(400).json({ error: 'phoneId is required' });
  }

  try {
    const result = await smsService.denyNumber(phoneId);
    logger.info(`Number denied successfully: ${phoneId}`);
    res.json({ message: 'Number denied successfully', result });
  } catch (error) {
    logger.error(`Error in denyNumber for phoneId ${phoneId}: ${error.message}`);
    res.status(500).json({ error: 'Failed to deny number' });
  }
}

export async function finishNumber(req, res, smsService) {
  const { phoneId } = req.body;
  if (!phoneId) {
    logger.warn('Missing phoneId in finishNumber request');
    return res.status(400).json({ error: 'phoneId is required' });
  }

  try {
    const result = await smsService.finishNumber(phoneId);
    logger.info(`Number finished successfully: ${phoneId}`);
    res.json({ message: 'Number finished successfully', result });
  } catch (error) {
    logger.error(`Error in finishNumber for phoneId ${phoneId}: ${error.message}`);
    res.status(500).json({ error: 'Failed to finish number' });
  }
}

export default { getNumber, getCode, denyNumber, finishNumber };
  
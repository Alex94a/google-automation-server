import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';


const configPath = path.join(process.cwd(), 'config/config.yml');

async function validateConfig(config) {
  const validationErrors = [];

  if (typeof config.server.port !== 'number' || config.server.port <= 0 || config.server.port > 65535) {
    validationErrors.push('Invalid server.port: should be a number between 1 and 65535');
  }

  if (typeof config.task.privateKey !== 'string' || config.task.privateKey.trim() === '') {
    validationErrors.push('Invalid task.privateKey: should be a non-empty string');
  }

  if (typeof config.task.youtubeChannel.isRequired !== 'boolean') {
    validationErrors.push('Invalid task.youtubeChannel.isRequired: should be a boolean');
  }
  if (typeof config.task.youtubeChannel.addBio !== 'boolean') {
    validationErrors.push('Invalid task.youtubeChannel.addBio: should be a boolean');
  }
  if (typeof config.task.youtubeChannel.addLogo !== 'boolean') {
    validationErrors.push('Invalid task.youtubeChannel.addLogo: should be a boolean');
  }

  if (typeof config.smsService.name !== 'string' || config.smsService.name.trim() === '') {
    validationErrors.push('Invalid smsService.name: should be a non-empty string');
  }
  if (typeof config.smsService.apiKey !== 'string' || config.smsService.apiKey.trim() === '') {
    validationErrors.push('Invalid smsService.apiKey: should be a non-empty string');
  }
  if (typeof config.smsService.country !== 'string' || config.smsService.country.trim() === '') {
    validationErrors.push('Invalid smsService.country: should be a non-empty string');
  }
  if (typeof config.smsService.maxPrice !== 'number' || config.smsService.maxPrice <= 0) {
    validationErrors.push('Invalid smsService.maxPrice: should be a number greater than 0');
  }

  if (validationErrors.length > 0) {
    throw new Error(`Config validation failed:\n- ${validationErrors.join('\n- ')}`);
  }
}

export async function readConfig() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    const config = yaml.load(data);

    await validateConfig(config);

    return config;
  } catch (error) {
    throw error;
  }
}


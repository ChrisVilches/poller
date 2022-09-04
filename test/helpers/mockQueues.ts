import {
  NOTIFICATIONS_QUEUE,
  TEST_QUEUE,
  PENDING_ENDPOINTS_QUEUE,
} from '@background-process/queues';
import { getQueueToken } from '@nestjs/bull';
import { TestingModuleBuilder } from '@nestjs/testing';

const queues = [NOTIFICATIONS_QUEUE, TEST_QUEUE, PENDING_ENDPOINTS_QUEUE];

const queueMock = {
  add: jest.fn(),
  process: jest.fn(),
  on: jest.fn(),
};

const overrideQueue = (module: TestingModuleBuilder, name: string) =>
  module.overrideProvider(getQueueToken(name)).useValue(queueMock);

export const mockQueues = (
  module: TestingModuleBuilder,
): TestingModuleBuilder => queues.reduce(overrideQueue, module);

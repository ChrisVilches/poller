import puppeteer from 'puppeteer';
import * as blockedData from './blocked-request-urls.json';
import { removeUrlQueryString } from './util';

const { blockedUrls, blockedTypes, blockedExtensions } = blockedData;

const isBlocked = (url: string): boolean => {
  for (const blocked of blockedUrls) {
    if (url.includes(blocked)) {
      return true;
    }
  }
  return false;
};

const isBlockedExtension = (url: string): boolean => {
  url = removeUrlQueryString(url);

  for (const blocked of blockedExtensions) {
    if (url.endsWith(blocked)) {
      return true;
    }
  }
  return false;
};

const shouldBlockRequest = (request: puppeteer.HTTPRequest): boolean => {
  if (isBlocked(request.url())) {
    return true;
  }
  if (blockedTypes.includes(request.resourceType())) {
    return true;
  }
  if (isBlockedExtension(request.url())) {
    return true;
  }

  return false;
};

interface RequestResult {
  data: string;
  status: number;
}

/**
 * Use this function to manage the browser and page.
 * This function should provide the callback with a page.
 * Ways to improve/change this would be to keep a singleton browser and
 * then use that one to create a new page.
 */
const withPage = async (
  callback: (page: puppeteer.Page) => Promise<RequestResult>,
): Promise<RequestResult> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  let result;
  try {
    result = await callback(page);
  } catch (err) {
    throw err;
  } finally {
    await browser.close();
  }

  return result;
};

const getDataFromPage = (url: string) => async (page: puppeteer.Page) => {
  let mainDocumentName = '';

  page.on('request', (request) => {
    if (shouldBlockRequest(request)) {
      request.abort();
      return;
    }

    if (request.resourceType() === 'document' && !mainDocumentName.length) {
      mainDocumentName = request.url();
    }

    request.continue();
  });

  let statusResult = 0;

  page.on('response', (response) => {
    if (response.url() === mainDocumentName) {
      statusResult = response.status();
    }
  });

  await page.goto(url, { waitUntil: 'networkidle0' });
  const resultHtml = await page.content();

  return {
    data: resultHtml,
    status: statusResult,
  };
};

export const getDynamicHTML = async (url: string): Promise<RequestResult> => {
  return withPage(getDataFromPage(url));
};

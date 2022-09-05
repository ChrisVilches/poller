import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Notifiable } from './Notifiable';

export interface SendinblueConfig {
  apiKey: string;
  senderName: string;
  senderEmail: string;
  recipientsListIds: number[];
}

const createHtmlContent = (title: string, url: string): string => `
  <p>${title}</p>  
  <p>
    <a href="${url}">${url}</a>
  </p>
`

export class SendinblueAPI implements Notifiable {
  private readonly logger = new Logger(SendinblueAPI.name);

  constructor(
    private readonly config: SendinblueConfig
  ) {}

  async notify(title: string, content: string, url: string) {
    try {
      const campaignId: number = await this.createCampaign(title, content, url)
      this.logger.debug(`Campaign created (ID: ${campaignId}). Sending now...`)

      const { status, statusText } = await this.sendNow(campaignId)
      this.logger.debug(`${status} | ${statusText}`)

    } catch(e) {
      this.logger.error(JSON.stringify(e.response.data))
    }
  }

  private async createCampaign(title: string, content: string, url: string): Promise<number> {
    const payload = {
      name: `Notification: ${title}`,
      subject: title,
      sender: {
        name: this.config.senderName,
        email: this.config.senderEmail,
      },
      type: 'classic',
      htmlContent: createHtmlContent(content, url),
      recipients: {
        listIds: this.config.recipientsListIds,
      },
    };

    const { data } = await axios.request({
      url: 'https://api.sendinblue.com/v3/emailCampaigns',
      method: 'post',
      headers: { 'api-key': this.config.apiKey },
      data: payload
    })

    return data.id;
  }

  private sendNow(campaignId: number) {
    return axios.request({
      url: `https://api.sendinblue.com/v3/emailCampaigns/${campaignId}/sendNow`,
      method: 'post',
      headers: { 'api-key': this.config.apiKey }
    })
  }
}

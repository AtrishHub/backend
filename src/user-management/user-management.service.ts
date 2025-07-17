import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserManagementService {
  private domain = process.env.AUTH0_DOMAIN; 
  private clientId = process.env.AUTH0_CLIENT_ID;
  private clientSecret = process.env.AUTH0_CLIENT_SECRET;
  private audience = `https://${this.domain}/api/v2/`;

  private async getManagementToken(): Promise<string> {
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials',
    });

    return response.data.access_token;
  }

  async getAllUsers(): Promise<any[]> {
    const token = await this.getManagementToken();

    const response = await axios.get(`${this.audience}users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}

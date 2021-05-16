import axios from 'axios';

class Api {
  constructor(host) {
    this.client = axios.create({
      baseURL: host,
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      withCredentials: false,
      credentials: 'include',
    });
  }

  /**
   * @return {Array}
   */
  async getRooms() {
    const { data: { result: data } } = await this.client.get('rooms');

    return data;
  }

  /**
   * @param {string} name
   * @return {Object}
   */
  async getRoomHistory(name) {
    const { data: { result: data } } = await this.client.get(`rooms/${name}/history`);

    return data;
  }
}

export default new Api(process.env.VUE_APP_HOST);

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 500,

  duration: '300s',
};

export default function () {
  http.get('https://mitrphol-dashboard.ml.thetigerteamacademy.net/zone/mpk');
  sleep(1);
}

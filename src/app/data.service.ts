import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


@Injectable()
export class DataService {
  status;
  config: any = {
    // api: 'http://localhost:8119',
    // api: 'http://vig-pool.tyk.im:8119',
    api: 'http://pool-1.vigcoin.org:8119',
    api_blockexplorer: 'http://vig-pool.tyk.im:19810',

    poolHost: 'vig-pool.tyk.im',

    poolPort: 6666,

    irc: 'irc.freenode.net/#vig',

    email: 'calidion@gmail.com',

    cryptonatorWidget: ['{symbol}-BTC', '{symbol}-USD', '{symbol}-EUR'],

    easyminerDownload: 'https://github.com/zone117x/cryptonote-easy-miner/releases/',

    blockchainExplorer: '/?hash={id}#blockchain_block',

    transactionExplorer: '/blockchina/transaction/{id}',

    themeCss: 'themes/default-theme.css',

    interval: 20000,

    networkStat: {
      'vig': [
        ['http://vig-pool.tyk.im', 'http://vig-pool.tyk.im:8119', 'https://pools.vigcoin.org', '主矿池'],
        ['http://pool-1.vigcoin.org', 'http://pool-1.vigcoin.org:8119', 'https://pools.vigcoin.org', '测试矿池']
      ],
      'bcn': [
        ['democats.org', 'http://pool.democats.org:7603']
      ]
    }
  };

  constructor(
    private http: HttpClient
  ) {
  }

  getStatus() {
    if (this.status) {
      return of(this.status);
    }
    this.get(this.config.api + '/stats').subscribe(data => {
      if (Object.keys(data).length > 0) {
        this.status = data;
      }
    });
  }

  get(url, params?) {
    return this.http.get(url, { params: params });
  }
  post(url, data) {
    return this.http.post(url, data);
  }

  timeAgo(time) {
    const now = new Date().getTime() / 1000;

    console.log(time);
    console.log(now);

    const diff = now - time;
    console.log('diff = ' + diff);
    if (diff < 60) {
      return '小于1分钟';
    }
    if (diff < 3600) {
      return (diff / 60).toFixed(0) + ' 分钟前';
    }

    if (diff < 24 * 3600) {
      return (diff / 3600).toFixed(0) + ' 小时前';
    }

    if (diff < 30 * 24 * 3600) {
      return (diff / 24 / 3600).toFixed(0) + ' 天前';
    }

    if (diff < 12 * 30 * 24 * 3600) {
      return (diff / 30 / 24 / 3600).toFixed(0) + ' 年前';
    }
  }

  formatAmounts(amount, unit) {
    const rounded = Math.round(amount);
    return '' + rounded + ' ' + unit;
  }

  getReadableTime(seconds) {

    const units: any = [[60, '秒'], [60, '分钟'], [24, '小时'],
    [7, '天'], [4, '周'], [12, '月'], [1, '年']];


    let amount = seconds;
    let i = 0;
    for (; i < units.length; i++) {
      if (amount < units[i][0]) {
        return this.formatAmounts(amount, units[i][1]);
      }
      amount = amount / units[i][0];
    }
    return this.formatAmounts(amount, units[i - 1][1]);
  }

  getBlockchainUrl(status, id) {
    return this.hashToUrl(status, id);
  }

  hashToUrl(status, id) {
    const explorer = this.config.blockchainExplorer;
    return explorer.replace('{symbol}', status.config.symbol.toLowerCase()).replace('{id}', id);
  }

  getTransactionUrl(status, id) {
    const explorer = this.config.transactionExplorer;
    return explorer.replace('{symbol}', status.config.symbol.toLowerCase()).replace('{id}', id);
  }

  getReadableCoins(status, coins, digits, withoutSymbol = null) {
    const amount = (parseInt(coins || 0, 10) / status.config.coinUnits).toFixed(digits || status.config.coinUnits.toString().length - 1);
    return amount + (withoutSymbol ? '' : (' ' + status.config.symbol));
  }

  formatDate(time) {
    if (!time) { return ''; }
    return new Date(parseInt(time, 10) * 1000).toLocaleString();
  }

  hashRateWithUnit(hashrate) {
    let i = 0;
    const byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH'];
    while (hashrate > 1000) {
      hashrate = hashrate / 1000;
      i++;
    }
    return hashrate.toFixed(2) + byteUnits[i];
  }


  getReadableHashRateString(hashrate) {
    return this.hashRateWithUnit(hashrate);
  }


}

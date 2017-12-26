/**
 * Created by umair on 03/01/17.
 */

import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import env from '../config/environment';

export default Base.extend({
  refreshTokenTimerId: null,
  refreshToken: null,
  restore(data) {
    return new Ember.RSVP.Promise( (resolve, reject) => {
      if (!Ember.isNone(data.jwt) && !Ember.isNone(data.refresh_token)) {

        //Schedule a refreshToken request
        this.scheduleRefreshTokenRequest(env.refreshTokenTimeout)
        this.refreshToken = data.refresh_token

        // Make an immediate request
        Ember.run.later(this, this.refreshTokenRequest, this.refreshToken, 0)
        resolve(data);
      } else {
        console.log("Old logging system detected. Logging out.");
        reject();
      }
    });
  },
  authenticate() {
    var args = [...arguments];
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.get(env.apiEndpoint + '/oneauth/login?grant_code=' + args[0], data => {
        if (!Ember.isNone(data.jwt) && !Ember.isNone(data.refresh_token)) {

          //Schedule a refreshToken request
          this.scheduleRefreshTokenRequest(env.refreshTokenTimeout)
          this.refreshToken = data.refresh_token
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  },
  scheduleRefreshTokenRequest (wait) {

    //cacel any scheduled request if already present
    if (!Ember.isNone(this.refreshTokenTimerId))
      Ember.run.cancel(this.refreshTokenTimerId)

    const id = Ember.run.later(this, this.refreshTokenRequest, this.refreshToken, wait)
    this.refreshTokenTimerId = id
  },
  refreshTokenRequest () {
    Ember.$.get(env.apiEndpoint + '/oneauth/refresh?refresh_token=' + this.refreshToken , (data) => {
      if (!Ember.isNone(data.jwt)) {
        this.scheduleRefreshTokenRequest(env.refreshTokenTimeout)
        this.trigger('sessionDataUpdated', {
          jwt: data.jwt,
          refresh_token: this.refreshToken,
          user_id: data.user_id,
          oauth_id: data.oauth_id
        })
      } else {
        this.trigger('sessionDataInvalidated')
      }
    })
  },
  invalidate(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      // keep on the event loop
      Ember.$.get(env.apiEndpoint+ '/oneauth/logout?refresh_token='+ this.refreshToken, data => {
        window.location.href = "https://account.codingblocks.com/logout?redirect=" + env.publicUrl;
        resolve();
      })
    });
  }
});

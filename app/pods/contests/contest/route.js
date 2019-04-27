import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  currentContest: service('current-contest'),

  model (params) {
    const contestId = params.contest_id;
    this.get('currentContest').setContest(contestId)
    return Ember.RSVP.hash({
      contest: this.get('store').findRecord('contest', contestId, {reload: true})
    })
  }
});

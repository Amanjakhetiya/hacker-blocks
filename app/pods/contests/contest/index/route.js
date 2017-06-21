import Ember from 'ember';
import Env from '../../../../config/environment';

const { inject: { service }, Route } = Ember;

export default Ember.Route.extend({
  ajax : service(),
  routing: service('-routing'),
  currentAttemptService: service('current-attempt'),
  currentUser: service('current-user'),
  breadCrumb: {
    title: 'Contest'
  },
  model() {
    let {contest} = this.modelFor('contests.contest');
    let tags = [];
    contest.get("problems").forEach(function (prob) {
      prob.get("tags").forEach(function (tag) {
        if(tags.indexOf(tag)===-1)
        {
          tags.pushObject(tag);
        }
      })
    });
    return Ember.RSVP.hash({
      contest: contest,
      tags:tags,
      currentAttempt: this.get('currentAttemptService').getCurrentAttempts(contest.id),
      leaderboard: this.get('store').query('submission', {contest_id: contest.id, custom: {ext: 'url', url: 'leaderboard'}}),
    }).then(hash=>{
        let contest = hash.contest;
        let contestId = contest.get('id');
        let authHeaders = this.get('currentUser').getAuthHeaders();

        hash.submissionCount = this.get('ajax').request(Env.apiEndpoint + '/api/submissions/submissionCount', {
          headers: authHeaders,
          data: { contestId: contestId },
          accepts: 'application/json'
        }).catch(err=>{
          console.error(err);
          return 0; // set submission count to zero
        });

        return Ember.RSVP.hash(hash);
      });
  },
  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('submissionCount', model.submissionCount ? model.submissionCount[0].count : 0 );
    let yourRank = model.leaderboard.get('meta').yourRank;
    controller.set('youRank', yourRank);
  },
  afterModel(model, transition) {
    const { currentAttempt, contest } = model;

    if ( Ember.isNone(contest.get('duration')) ) {
      return
    }

    if (currentAttempt.id === "0")  {
      this.transitionTo('contests.contest.attempt', model.contest.id)
    }
  }
});

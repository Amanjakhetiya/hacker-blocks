/**
 * Created by umair on 30/12/16.
 */

import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  cId: DS.attr(),
  problemCount: DS.attr (),
  contests: DS.belongsTo('contest')
});

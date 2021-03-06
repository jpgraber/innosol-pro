const mongoose         = require('mongoose');
const Schema           = mongoose.Schema;
const reportCollection = require('./report-collection.model');

const teamSchema = new Schema({
  name              : String,
  reportCollections : [reportCollection.schema],
  createdDate       : Date,
  userCount         : Number,
  neo4jConnection   : String,
  neo4jAuth         : String,
  lastActivityDate  : Date,
  imageURL          : String,
  downloadCount     : Number
});

teamSchema.virtual('reportCollectionCount').get(function() {
  return this.reportCollections.length;
});

teamSchema.virtual('reportCount').get(function() {
  return this.reportCollections.reduce((acc, cur) => {
    return acc + cur.reports.length;
  }, 0);
});

teamSchema.virtual('id').get(function() {
  return this._id.toString();
});

teamSchema.virtual('clientProps').get(function() {
  const { name, reportCollections, createdDate, userCount, neo4jConnection, neo4jAuth, reportCollectionCount, reportCount, id, downloadCount } = this;
  return { name, reportCollections, createdDate, userCount, neo4jConnection, neo4jAuth, reportCollectionCount, reportCount, id, downloadCount};
})

module.exports = mongoose.model('Team', teamSchema);

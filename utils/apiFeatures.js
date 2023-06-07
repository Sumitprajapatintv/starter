class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.querystring = queryString;
  }
  filter() {
    const queryObj = { ...this.querystring };
    const excluedfields = ['page', 'sort', 'limit', 'feilds'];
    excluedfields.forEach((el) => delete queryObj[el]);
    // console.log(req.query);

    //Advance Filteing
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.querystring.sort) {
      const sortBy = this.querystring.sort.split(',').joins(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    }

    return this;
  }
  limitFeild() {
    if (this.querystring.feilds) {
      const feilds = this.querystring.feilds.split(',').join(' ');
      this.query = this.query.select(feilds);
    }
    return this;
  }
  pagination() {
    const page = this.querystring.page * 1 || 1;
    const limit = this.querystring.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;

class ApiFeatures {
  constructor(query) {
    this.query = query;

    this.where = {};
    this.orderBy = {};
    this.skip = 0;
    this.take = 20;

    this.pagination = {
      page: 1,
      limit: 20,
    };
  }

  paginate() {
    const rawPage = typeof this.query.page === "string" ? this.query.page : "1";

    const rawLimit =
      typeof this.query.limit === "string" ? this.query.limit : "20";

    let page = Number(rawPage);
    let limit = Number(rawLimit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 20;
    }

    limit = Math.min(limit, 100);

    this.take = limit;
    this.skip = (page - 1) * limit;

    this.pagination = {
      page,
      limit,
    };

    return this;
  }

  search(fields = []) {
    const search =
      typeof this.query.search === "string" ? this.query.search.trim() : "";

    if (!search || fields.length === 0) {
      return this;
    }

    this.where.OR = fields.map((field) => ({
      [field]: {
        contains: search,
        mode: "insensitive",
      },
    }));

    return this;
  }

  filter(options = {}) {
    const { fields = [], booleans = [], numbers = [] } = options;

    for (const field of fields) {
      if (!(field in this.query)) continue;

      let value = this.query[field];

      if (Array.isArray(value)) continue;

      if (booleans.includes(field)) {
        if (value === "true") value = true;
        else if (value === "false") value = false;
        else continue;
      }

      if (numbers.includes(field)) {
        value = Number(value);

        if (Number.isNaN(value)) continue;
      }

      this.where[field] = value;
    }

    return this;
  }

  range(field, minKey, maxKey) {
    const rawMin = this.query[minKey];
    const rawMax = this.query[maxKey];

    const hasMin =
      typeof rawMin === "string" &&
      rawMin.trim() !== "" &&
      !Number.isNaN(Number(rawMin));

    const hasMax =
      typeof rawMax === "string" &&
      rawMax.trim() !== "" &&
      !Number.isNaN(Number(rawMax));

    if (!hasMin && !hasMax) {
      return this;
    }

    this.where[field] = {};

    if (hasMin) {
      this.where[field].gte = Number(rawMin);
    }

    if (hasMax) {
      this.where[field].lte = Number(rawMax);
    }

    return this;
  }

  sort(allowedFields = []) {
    const sortBy =
      typeof this.query.sortBy === "string" ? this.query.sortBy : null;

    const sortOrder =
      typeof this.query.sortOrder === "string" ? this.query.sortOrder : "desc";

    if (sortBy && allowedFields.includes(sortBy)) {
      this.orderBy = {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc",
      };
    } else {
      this.orderBy = {
        createdAt: "desc",
      };
    }

    return this;
  }
}

module.exports = ApiFeatures;

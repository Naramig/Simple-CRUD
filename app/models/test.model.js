module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        testString: String
      },
      { timestamps: false }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const TestDB = mongoose.model("testDB", schema);
    return TestDB;
  };
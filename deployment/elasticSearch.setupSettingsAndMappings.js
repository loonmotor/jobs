var
	elasticsearch = require('elasticsearch')
	, client = new elasticsearch.Client({

	})
	, fs = require('fs')
	, callback = function (err, result) {
		if (err) {
			console.log(err);
		}
		fs.writeFile('elastic-search-log.json', JSON.stringify(result, null, 4));
	}
	, async = require('async');

async.series([
	function (ok) {
		client.indices.create({
			index : 'db',
			body : {
			    "settings" : {
					"number_of_shards" : 1,
					"analysis" : {
						"filter" : {
							"my_shingle_filter" : {
								"type" : "shingle",
								"min_shingle_size" : 2,
								"max_shingle_size" : 2,
								"output_unigrams" : true
							},
							"autocomplete_filter" : {
								"type" : "edge_ngram",
								"min_gram" : 1,
								"max_gram" : 20
							}
						},
						"analyzer" : {
							"my_shingle_analyzer" : {
								"type" : "custom",
								"tokenizer" : "standard",
								"filter" : [
									"lowercase",
									"my_shingle_filter"
								]
							},
							"autocomplete" : {
								"type" : "custom",
								"tokenizer" : "standard",
								"filter" : [
									"lowercase",
									"autocomplete_filter"
								]
							}
						}
					}
				},
				"mappings" : {
					"jobs" : {
						"properties" : {
							"title" : {
								"type" : "multi_field",
								"fields" : {
									"title" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "english"
									},
									"shingle" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "my_shingle_analyzer"
									},
									"ngram" : {
										"type" : "string",
										"analyzer" : "autocomplete"
									}
								}
							},
							"companyName" : {
								"type" : "multi_field",
								"fields" : {
									"companyName" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "standard"
									},
									"shingle" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "my_shingle_analyzer"
									},
									"ngram" : {
										"type" : "string",
										"analyzer" : "autocomplete"
									}
								}
							},
							"location" : {
								"type" : "multi_field",
								"fields" : {
									"location" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "standard"
									},
									"shingle" : {
										"type" : "string",
										"index" : "analyzed",
										"analyzer" : "my_shingle_analyzer"
									},
									"ngram" : {
										"type" : "string",
										"analyzer" : "autocomplete"
									}
								}
							}
						}
					}
				}
			}
		}, ok);
	}
], callback);



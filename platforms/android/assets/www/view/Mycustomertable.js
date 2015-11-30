/**
 * PENDING ITEMS 1. Integrate praffulla code - UpSync DAO (SyncGet, SyncPut,
 * Clean)
 */

// customer local table
var customertableLocalDAO = {
   metadata : {
        "tableName" : "tbl_My_Customer_Master_with_locationChanges",
        "columns" : [{
                     name : "emailId",
                     columnName : "Email_Id",
                     pk : true
                    }, {
                     name : "userId",
                     columnName : "User_Id"
                    }, {
                     name : "customerId",
                     columnName : "Customer_Id"
                    },{
                     name : "firstName",
                     columnName : "First_Name"
                    }, {
                     name : "lastName",
                     columnName : "Last_Name"
                    }, {
                     name : "phone",
                     columnName : "Phone_No"
                    }, {
                     name : "categoryName",
                     columnName : "Category_Name"
                    },{
                     name : "categoryId",
                     columnName : "Category_Id"
                    },{
                     name : "specialityId",
                     columnName : "Speciality_Id"
                    },{
                     name : "specialityName",
                     columnName : "Speciality_Name"
                    },{
                     name : "locationId",
                     columnName : "Customer_Location_Id"
                    },{
                     name : "location",
                     columnName : "Customer_Location"
                    },{
                     name : "Customer_Category2",
                     columnName : "Customer_Category2"
                    },{
                     name : "Customer_Category3",
                     columnName : "Customer_Category3"
                    },{
                     name : "modifiedBy",
                     columnName : "Modified_By"
                    },{
                     name : "modifiedDate",
                     columnName : "Modified_Date"
                    },{
                     name : "status",
                     columnName : "Status"
                    }]
    },
    
    insert : function(user, success, failure) {
        //customertableLocalDAO.remove(null);
        mycustomercoreDAO.insert(this, user, success, failure);
    },
    
    update : function(user, success, failure) {
        mycustomercoreDAO.update(this, user, success, failure);
    },
    
    remove : function(user, success, failure) {
        var criteria = {};
        criteria.user = user;
        return mycustomercoreDAO.remove(this, criteria, success, failure);
    },
    
    getByData: function (customerId, success, failure) {
        var criteria = {};
        criteria.customerId = customerId;
        var result = null;
        mycustomercoreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
            } else {
                result = null;
            }
            success(result);
        }, failure);
        return result;
    },
    
    getByEmailData: function (emailId, success, failure) {
        var criteria = {};
        criteria.emailId = emailId;
        var result = null;
        mycustomercoreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
            } else {
                result = null;
            }
            success(result);
        }, failure);
        return result;
    },
    
    get : function(success, failure) {
        mycustomercoreDAO.getEquals(this, null, function(users) {
            var result = null;
                if (users.length > 0) {
                result = users[0];
                }
            success(result);
            }, failure);
    },
    getAll: function(success, failure){
        mycustomercoreDAO.getEquals(this, {}, success, failure);
    },
    clean : function(context, data, success, failure) {
        customertableLocalDAO.remove(null, success, failure);
    }
};
// customer local table

// DAO begins here
var mycustomercoreDAO = {

	    insert: function (entityClass, entity, success, failure) {
	        var _this = this;
	        this._initializeEntity(entityClass, true, function (response) {
	            _this._insert(entityClass, entity, success, failure);
	        }, failure);
	    },

	    _insert: function (entityClass, entity, success, failure) {
	        if (entity instanceof Array) {
	            this._insertMulti(entityClass, entity, success, failure);
	        } else {
                this._insertSingle(entityClass, entity, success, failure);
	        }
	    },

	    _insertSingle: function (entityClass, entity, success, failure) {
	        var query = this._buildInsert(entityClass);
	        var params = this._prepareInsertParams(entityClass, entity);
            this._execute(query, params, success, failure);
	    },

	    _insertMulti: function (entityClass, entites, success, failure) {
	        var query = this._buildInsert(entityClass);
	        var params = [];
	        var _this = this;
	        $.each(entites, function (index, entity) {
	            params.push(_this._prepareInsertParams(entityClass, entity));
	        });
	        return this._executeMulti(query, params, success, failure);
	    },

	    _buildInsert: function (entityClass) {
	        var columns = '';
	        var paramPlaceHolders = '';
	        var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            columns += entityClass.metadata.columns[i].columnName;
	            paramPlaceHolders += '?';

	            if (columns == null) {
	                columns = '';
	                paramPlaceHolders = '';
	            } else {
	                if (i != (noOfColumns - 1)) {
	                    columns += ', ';
	                    paramPlaceHolders += ', ';
	                }

	            }

	        }
	        var query = 'INSERT INTO ' + entityClass.metadata.tableName + ' ( ' + columns + ') VALUES (' + paramPlaceHolders + ');';
            return query;
	    },

	    _prepareInsertParams: function (entityClass, entity) {
            var params = [];
            var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            var currentName = entityClass.metadata.columns[i].name;
                value = entity[currentName];
                if (value == null) {
	                value = '';
	            }
	            params.push(value);
	        }
            return params;
	    },

	    update: function (entityClass, entity, success, failure) {
            var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._update(entityClass, entity, success, failure);
	        }, failure);
	        result;
	    },

	    excuteUpdate: function (query, success, failure) {
	        this._execute(query, [], success, failure);
	    },

	    _update: function (entityClass, entity, success, failure) {
            var query = 'UPDATE ' + entityClass.metadata.tableName + ' SET ';
	        var columns = null;
	        var params = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            if (entityClass.metadata.columns[i]['pk'] == null
	                    || !entityClass.metadata.columns[i].pk) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (entity[currentName] != null) {
	                    if (columns == null) {
	                        columns = '';
	                    } else {
	                        columns += ', ';
	                    }
	                    columns += entityClass.metadata.columns[i].columnName
	                            + ' = ?';
	                    params.push(entity[currentName]);
	                }
	            }
	        }
	        query += columns;
	        var whereClause = null;
	        for (var i = 0; i < noOfColumns; i++) {
	            if (entityClass.metadata.columns[i]['pk'] != null
	                    && entityClass.metadata.columns[i].pk) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (entity[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' = ?';
	                    params.push(entity[currentName]);
	                }
	            }
	        }
	        if (whereClause != null) {
	            query += whereClause;
	        }

	        return this._execute(query, params, success, failure);
	    },

	    remove: function (entityClass, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._remove(entityClass, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _remove: function (entityClass, criteria, success, failure) {
	        var query = 'DELETE FROM ' + entityClass.metadata.tableName;
	        var params = [];
	        if (criteria != null) {
	            var whereClause = null;
	            var noOfColumns = entityClass.metadata.columns.length;

	            for (var i = 0; i < noOfColumns; i++) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (criteria[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' = ?';
	                    params.push(criteria[currentName]);
	                }
	            }
	            if (whereClause != null) {
	                query += whereClause;
	            }
	        }
	        return this._execute(query, params, success, failure);
	    },

	    executeQuery: function (query, rowMapperCallback, success, failure) {
	        this._initialize();
	        var params = [];
	        var result = [];
	        this._execute(query, params, function (response) {
	            if (response != null && response.result != null
	                    && response.result.rows != null) {

	                for (var j = 0; j < response.result.rows.length; j++) {

	                    var row = response.result.rows.item(j);
	                    var record = rowMapperCallback(row);
	                    result.push(record);
	                }
	            }
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);
	        return result;
	    },

	    getEquals: function (entityClass, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._getEquals(entityClass, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _getEquals: function (entityClass, criteria, success, failure) {
	        var query = 'SELECT ';
	        var columns = null;
	        var params = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            var currentColumnName = entityClass.metadata.columns[i].columnName;
	            if (columns == null) {
	                columns = '';
	            } else {
	                columns += ', ';
	            }
	            columns += currentColumnName;
	        }
	        query += columns;
	        query += ' FROM ' + entityClass.metadata.tableName + ' ';
	        if (criteria != null) {
	            var whereClause = null;
	            for (var i = 0; i < noOfColumns; i++) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (criteria[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' = ?';
	                    params.push(criteria[currentName]);
	                }
	            }
	            if (whereClause != null) {
	                query += whereClause;
	            }
	        }
	        var result = [];
	        var _this = this;
	        this._execute(query, params, function (response) {
	            result = _this._prepareResponse(entityClass, response);
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);


	        return result;
	    },

	    _prepareResponse: function (entityClass, response) {
	        var result = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        if (response != null && response.result != null
	                && response.result.rows != null) {

	            for (var j = 0; j < response.result.rows.length; j++) {
	                var record = {};
	                var row = response.result.rows.item(j);
	                for (var i = 0; i < noOfColumns; i++) {
	                    if (row[entityClass.metadata.columns[i].columnName] != null) {
	                        if (entityClass.metadata.columns[i].isDate == true) {
	                            if (row[entityClass.metadata.columns[i].columnName] != "") {
	                                record[entityClass.metadata.columns[i].name] = new Date(
	                                        row[entityClass.metadata.columns[i].columnName]);
	                            }
	                        } else {
	                            record[entityClass.metadata.columns[i].name] = row[entityClass.metadata.columns[i].columnName];
	                        }
	                    }
	                }
	                result.push(record);
	            }
	        }

	        return result;
	    },

	    getNotEquals: function (entityClass, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._getNotEquals(entityClass, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _getNotEquals: function (entityClass, criteria, success, failure) {
	        var query = 'SELECT ';
	        var columns = null;
	        var params = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            var currentColumnName = entityClass.metadata.columns[i].columnName;
	            if (columns == null) {
	                columns = '';
	            } else {
	                columns += ', ';
	            }
	            columns += currentColumnName;
	        }
	        query += columns;
	        query += ' FROM ' + entityClass.metadata.tableName + ' ';
	        if (criteria != null) {
	            var whereClause = null;
	            for (var i = 0; i < noOfColumns; i++) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (criteria[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' != ?';
	                    params.push(criteria[currentName]);
	                }
	            }
	            if (whereClause != null) {
	                query += whereClause;
	            }
	        }

	        var result = [];
	        var _this = this;
	        this._execute(query, params, function (response) {
	            result = _this._prepareResponse(entityClass, response);
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);


	        return result;
	    },

	    removeNotEquals: function (entityClass, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._removeNotEquals(entityClass, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _removeNotEquals: function (entityClass, criteria, success, failure) {
	        // DANGER: Passing NULL criteria or the Criteria with no element in it,
	        // will remove all the records.
	        // If need this has to be separated (remove and removeAll);
	        this._initializeEntity(entityClass, true);
	        var query = 'DELETE FROM ' + entityClass.metadata.tableName;
	        var params = [];
	        if (criteria != null) {
	            var whereClause = null;
	            var noOfColumns = entityClass.metadata.columns.length;

	            for (var i = 0; i < noOfColumns; i++) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (criteria[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' != ?';
	                    params.push(criteria[currentName]);
	                }
	            }
	            if (whereClause != null) {
	                query += whereClause;
	            }
	        }
	        return this._execute(query, params, success, failure);
	    },

	    getLike: function (entityClass, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._getLike(entityClass, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _getLike: function (entityClass, criteria, success, failure) {
	        var query = 'SELECT ';
	        var columns = null;
	        var params = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        for (var i = 0; i < noOfColumns; i++) {
	            var currentColumnName = entityClass.metadata.columns[i].columnName;
	            if (columns == null) {
	                columns = '';
	            } else {
	                columns += ', ';
	            }
	            columns += currentColumnName;
	        }
	        query += columns;
	        query += ' FROM ' + entityClass.metadata.tableName + ' ';
	        if (criteria != null) {
	            var whereClause = null;
	            for (var i = 0; i < noOfColumns; i++) {
	                var currentName = entityClass.metadata.columns[i].name;
	                if (criteria[currentName] != null) {
	                    if (whereClause == null) {
	                        whereClause = ' WHERE ';
	                    } else {
	                        whereClause += ' AND ';
	                    }
	                    whereClause += entityClass.metadata.columns[i].columnName
	                            + ' LIKE ? ';
	                    params.push('%' + criteria[currentName] + '%');
	                }
	            }
	            if (whereClause != null) {
	                query += whereClause;
	            }
	        }

	        var result = [];
	        var _this = this;
	        this._execute(query, params, function (response) {
	            result = _this._prepareResponse(entityClass, response);
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);

	        return result;
	    },
	    _connection: null,

	    _initialize: function () {
	        if (this._connection == null) {
	            this._connection = window.openDatabase("ELEARNING_DB", "1.0",
	                    "iLearing Database", 200000);
	        }
	    },

	    _execute: function (query, params, success, failure) {
	        var response = {
	            statusCode: 0,
	            result: null,
	            error: null
	        };


	        this._connection.transaction(function (tx) {
	            tx.executeSql(query, params, function (tx, queryResult) {
	                response.statusCode = 0;
	                response.result = queryResult;
	                if (typeof success == 'function') {
	                    success(response);
	                }
	            }, function (error) {
	                response.statusCode = -1;
	                response.error = error;
	                if (typeof failure == 'function') {
	                    failure(response);
	                }
	            });
	        }, function (error) {
	            response.statusCode = -1;
	            response.error = error;
	            if (typeof failure == 'function') {
	                failure(response);
	            }
	        });
	        return response;

	    },

	    _executeMulti: function (query, params, success, failure) {
	        var response = {
	            statusCode: 0,
	            result: null,
	            error: null
	        };

	        this._connection.transaction(function (tx) {
	            var responses = [];
	            $.each(params, function (index, param) {
	                response = {
	                    statusCode: 0,
	                    result: null,
	                    error: null
	                };
	                tx.executeSql(query, param, function (tx, queryResult) {
	                    response.statusCode = 0;
	                    response.result = queryResult;
	                    responses.push(response);
	                }, function (error) {
	                    response.statusCode = -1;
	                    response.error = error;
	                    responses.push(response);
	                });
	            });
	            if (typeof success == 'function') {
	                success(responses);
	            }
	        }, function (error) {
	            response.statusCode = -1;
	            response.error = error;
	            if (typeof failure == 'function') {
	                failure(response);
	            }
	        });
	        return response;

	    },

	    executeCustomQuery: function (entityClass, query, entity, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            _this._executeCustomQuery(entityClass, query, entity, success, failure);
	        }, failure);
	        return result;
	    },

	    _executeCustomQuery: function (entityClass, query, params, success, failure) {
	        if (params == null) {
	            params = [];
	        }
	        var result = [];
	        var _this = this;

	        this._execute(query, params, function (response) {
	            result = _this._prepareResponse(entityClass, response);
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);
	        return result;
	    },

	    _initializeEntity: function (entityClass, createTableRequired, success, failure) {
	        this._initialize();
	        if (createTableRequired == null) {
	            createTableRequired = false;
	        }
	        if (createTableRequired == true) {
	            var query = 'CREATE TABLE IF NOT EXISTS '
	                + entityClass.metadata.tableName + ' ( ';
	            var uniqueKeys = null;

	            var noOfColumns = entityClass.metadata.columns.length;
	            for (var i = 0; i < noOfColumns; i++) {
	                if (i != 0) {
	                    query += ", ";
	                }
	                query += entityClass.metadata.columns[i].columnName;
	                if (entityClass.metadata.columns[i]['pk'] != null) {
	                    if (entityClass.metadata.columns[i].pk) {
	                        if (uniqueKeys == null) {
	                            uniqueKeys = entityClass.metadata.columns[i].columnName;
	                        } else {
	                            uniqueKeys += ("," + entityClass.metadata.columns[i].columnName);
	                        }
	                    }
	                }
	            }

	            if (uniqueKeys != null) {
	                query += ", CONSTRAINT " + entityClass.metadata.tableName
	                        + "_pk UNIQUE (" + uniqueKeys + ")";
	            }

	            query += ")";
	            this._execute(query, [], success, failure);
	        }

	    },

	    getBetween: function (entityClass, criteria, success, failure) {
	        var _this = this;
	        var result = [];
	        this._initializeEntity(entityClass, true, function (response) {
	            result = _this._getBetween(entityClass, criteria, success, failure);
	        }, failure);
	        return result;
	    },

	    _getBetween: function (entityClass, criteria, success, failure) {
	        this._initializeEntity(entityClass, true);
	        var query = 'SELECT ';
	        var columns = null;
	        var params = [];
	        var noOfColumns = entityClass.metadata.columns.length;
	        var dbColumnName = null;
	        for (var i = 0; i < noOfColumns; i++) {
	            var currentColumnName = entityClass.metadata.columns[i].columnName;
	            if (columns == null) {
	                columns = '';
	            } else {
	                columns += ', ';
	            }
	            columns += currentColumnName;
	            if (criteria.columnName == entityClass.metadata.columns[i].name) {
	                dbColumnName = currentColumnName;
	            }
	        }
	        query += columns;
	        query += ' FROM ' + entityClass.metadata.tableName + ' ';
	        var whereClause = ' WHERE ' + dbColumnName + " BETWEEN ? AND ? ";

	        params.push(criteria.start);
	        params.push(criteria.end);

	        if (whereClause != null) {
	            query += whereClause;
	        }

	        var result = [];
	        var _this = this;
	        this._execute(query, params, function (response) {
	            result = _this._prepareResponse(entityClass, response);
	            if (typeof success == 'function') {
	                success(result);
	            }
	        }, failure);

	        return result;
	    },

	    updateTable: function (entityClass, success, failure) {
	        var _this = coreDAO;
	        _this._initialize();
	        this._initializeEntity(entityClass, true);
	        var columns = entityClass.metadata.columns;
	        var tableName = entityClass.metadata.tableName;
	        var colLength = 0;
	        if (columns != null) {
	            colLength = columns.length - 1;
	        }

	        $.each(columns, function (index, column) {
	            var colName = column.columnName;
	            console.log("Table: " + tableName + "  Column: " + colName);
	            _this._connection.transaction(function (tx) {
	                tx.executeSql("select " + colName + " from " + tableName + " LIMIT 1", [], querySuccess, queryFail);
	            }, function errorFunction(err) {
	                console.log("Transaction failure => errorcb-->error msg " + err.error + " error code " + err.code);
	            }, function successFunction() {
	                console.log("success!");
	            });

	            function querySuccess(tx, results) {
	                console.log("querySuccess!");
	                // console.log(JSON.stringify(results.rows));
	            }
	            function queryFail(err) {
	                console.log("Query Failure => errorcb-->error msg " + err.error + " error code " + err.code);
	                // IF queryFail reached column not found so again use
					// executeSql() function for add new column
	                addColumn();
	            }
	            function addColumn() {
	                var query = "ALTER TABLE " + tableName + " ADD COLUMN " + colName;
	                console.log('in alter table....' + query);
	                _this._execute(query, []);
	            }

	            console.log(' column index' + index + 'total colLength' + colLength);
	            if (colLength == index) {
	                success();
	            }
	        });
	    }
};
// DAO ends here
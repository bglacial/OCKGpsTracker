import {Injectable} from '@angular/core';
/*
 Generated class for the Sqlite provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var window:any;
@Injectable()
export class Sqlite {
    public text:string = "";
    public db = null;
    public arr = [];
    public arrSessionDetail = [];
    public lastSessionId = null;

    constructor() {
    }

    /**
     *
     * Open The Datebase
     */
    openDb() {
        this.db = window
            .sqlitePlugin
            //.openDatabase({name: 'ockGpsTracker.db', location: 'default'});
            .openDatabase({name: 'ockGpsTracker9.db', location: 'default'});
        this
            .db
            .transaction((tx) => {
                tx.executeSql('CREATE TABLE IF NOT EXISTS session_detail (session_detail_id INTEGER PRIMARY KEY, session_detail_fk_session_id INT,session_detail_coord_lat TEXT, session_detail_coord_long TEXT, session_detail_coord_speed TEXT)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS session (session_id INTEGER PRIMARY KEY,session_date DATE)');
            }, (e) => {
                console.log('Transtion Error', e);
            }, () => {
                console.log('Populated Datebase OK..');
            })
    }

    /**
     *
     * @param addSession for adding: function
     */
    addSession() {
        return new Promise(resolve => {
            var InsertQuery = "INSERT INTO session (session_date) VALUES (date('now'))";
            this
                .db
                .executeSql(InsertQuery, [], (r) => {
                    console.log('Inserted session ... Sucess..');
                    this.lastSessionId = r.insertId;
                    this
                        .getSessions()
                        .then(s => {
                            resolve(true)
                        });
                }, e => {
                    console.log('Inserted session Error', e);
                    resolve(false);
                })
        })
    }

    addSessionDetail(sessionId, position, speed) {

        return new Promise(resolve => {
            var InsertQuery = "INSERT INTO session_detail (session_detail_fk_session_id,session_detail_coord_lat, session_detail_coord_long, session_detail_coord_speed) VALUES (?,?,?,?)";
            this
                .db
                /*.executeSql(InsertQuery, [], (r) => {
                 console.log('Inserted SessionDetail ... Sucess..');
                 alert('resultSet.insertId: ' + r.insertId);
                 alert('resultSet.rowsAffected: ' + r.rowsAffected);
                 alert(JSON.stringify(r));

                 }, e => {
                 console.log('Inserted Error SessionDetail ', e);
                 alert('Inserted SessionDetail Error');
                 alert(JSON.stringify(e));
                 resolve(false);
                 })*/
                .executeSql(InsertQuery, [sessionId, position.coords.latitude, position.coords.longitude, speed], (r) => {
                }, e => {
                    console.log('Inserted Error SessionDetail ', e);
                    alert('Inserted SessionDetail Error');
                    alert(JSON.stringify(e));
                    resolve(false);
                })
        })
    }

    //Refresh everytime
    getSessions() {
        return new Promise(res => {
            this.arr = [];
            let query = "SELECT * FROM session";
            this
                .db
                .executeSql(query, [], rs => {
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            var item = rs
                                .rows
                                .item(i);
                            this
                                .arr
                                .push(item);
                        }
                    }
                    res(true);
                }, (e) => {
                    console.log('Sql Query Error', e);
                });
        })

    }

    getSessionDetail(sessionId) {
        return new Promise(res => {
            this.arrSessionDetail = [];
            let query = "SELECT * FROM session_detail WHERE session_detail_fk_session_id=?";
            this
                .db
                .executeSql(query, [sessionId], rs => {
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            var item = rs
                                .rows
                                .item(i);
                            this
                                .arrSessionDetail
                                .push(item);
                        }
                    }
                    res(true);
                }, (e) => {
                    console.log('Sql Query Error', e);
                    alert('Error : getSessionDetail');
                    alert(JSON.stringify(e));
                });
        })

    }

    getSessionsDetail() {
        return new Promise(res => {
            this.arrSessionDetail = [];
            let query = "SELECT * FROM session_detail";
            this
                .db
                .executeSql(query, [], rs => {
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            var item = rs
                                .rows
                                .item(i);
                            this
                                .arrSessionDetail
                                .push(item);
                        }
                    }
                    res(true);
                }, (e) => {
                    console.log('Sql Query Error', e);
                });
        })

    }

    //to delete any Item
    del(id) {
        return new Promise(resolve => {
            var query = "DELETE FROM session WHERE session_id=?";
            this
                .db
                .executeSql(query, [id], (s) => {
                    console.log('Delete Success...', s);
                    this
                        .getSessions()
                        .then(s => {
                            resolve(true);
                        });
                }, (err) => {
                    console.log('Deleting Error', err)
                });
        })

    }

    //to Update any Item
    update(id, txt) {
        return new Promise(res => {
            var query = "UPDATE session SET session_date=date('now')  WHERE session_id=?";
            this
                .db
                .executeSql(query, [
                    txt, id
                ], (s) => {
                    console.log('Update Success...', s);
                    this
                        .getSessions()
                        .then(s => {
                            res(true);
                        });
                }, (err) => {
                    console.log('Updating Error', err);
                });
        })

    }

}

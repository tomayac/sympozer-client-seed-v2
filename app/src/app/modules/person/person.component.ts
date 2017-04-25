import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {DBLPDataLoaderService} from "../../dblpdata-loader.service";
import {LocalDAOService} from "../../localdao.service";
import {Encoder} from "../../lib/encoder";
import {PersonService} from "./person.service";
import {Mutex} from 'async-mutex';
import {routerTransition} from '../../app.router.animation';
import {ManagerRequest} from "../../services/ManagerRequest";

@Component({
    selector: 'app-person',
    templateUrl: 'person.component.html',
    styleUrls: ['person.component.css'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class PersonComponent implements OnInit {
    private externPublications = [];
    private avatar: any;
    public person;
    public roles = [];
    public orgas = [];
    public publiConf = [];
    private mutex: any;
    private mutex_box: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private DaoService: LocalDAOService,
                private personService: PersonService,
                private encoder: Encoder,
                private  dBPLDataLoaderService: DBLPDataLoaderService,
                private managerRequest: ManagerRequest) {
        this.person = this.personService.defaultPerson();
        this.mutex = new Mutex();
        this.mutex_box = new Mutex();
    }

    ngOnInit() {
        const that = this;
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            let name = params['name'];

            if (!id || !name) {
                return false;
            }

            that.getPublication(name);

            let query = {'key': this.encoder.decode(id)};
            this.DaoService.query("getPerson", query, (results) => {
                that.mutex
                    .acquire()
                    .then(function (release) {
                        const nodeLabel = results['?label'];
                        const nodeBox = results['?box'];

                        if (nodeLabel) {
                            const label = nodeLabel.value;

                            if (label) {
                                let boxs = [];

                                that.person = {
                                    name: label,
                                    boxs: boxs,
                                };

                                if(nodeBox){
                                    const boxs_temp = nodeBox.value;
                                    if(boxs_temp){
                                        switch(typeof boxs_temp){
                                            case "string":
                                                boxs = [boxs_temp];
                                                break;
                                            default:
                                                boxs = boxs_temp;
                                                break;
                                        }
                                    }

                                    for(const box of boxs){
                                        that.mutex_box
                                            .acquire()
                                            .then((release_mutex_box) => {
                                                if(that.avatar && that.avatar.length > 0){
                                                    release_mutex_box();
                                                    return false;
                                                }

                                                that.managerRequest.get_safe('http://localhost:3000/user/sha1?email_sha1='+box)
                                                    .then((request) => {
                                                        if(request && request._body)
                                                        {
                                                            const user = JSON.parse(request._body);
                                                            if(user && user.avatar_view){
                                                                that.avatar = 'http://localhost:3000/' + user.avatar_view;
                                                            }
                                                        }
                                                    });
                                                release_mutex_box();
                                            });
                                    }
                                }
                            }
                        }
                        release();
                    });
            });

            this.DaoService.query("getPublicationLink", query, (results, err) => {
                that.mutex
                    .acquire()
                    .then(function (release) {
                        that.publiConf = that.personService.generatePublicationLinkFromStream(that.publiConf, results);
                        release();
                    });
            });

            this.DaoService.query("getOrganizationLink", query, (results) => {
                that.mutex
                    .acquire()
                    .then(function (release) {
                        that.orgas = that.personService.generateOrgasFromStream(that.orgas, results);
                        release();
                    });
            });

            this.DaoService.query("getRole", query, (results) => {
                console.log('roles: ', results);
                that.mutex
                    .acquire()
                    .then(function (release) {
                        that.roles = that.personService.generateRolesFromStream(that.roles, results);
                        release();
                    });
            });
        });
    }

    getPublication(name: any) {
        // this.dBPLDataLoaderService.getAuthorPublications(person.value.name).then(response => {
        this.dBPLDataLoaderService.getAuthorPublications(name).then(response => {
            console.log(response);
            if (response.results) {
                let i = 0;
                for (let result of response.results.bindings) {
                    this.externPublications[i] = {
                        id: this.encoder.encodeForURI(result.publiUri.value),
                        name: result.publiTitle.value
                    };
                    i++;
                }
            }
        });
    };
}

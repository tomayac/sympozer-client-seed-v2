import {forEach} from "@angular/router/src/utils/collection";
import {Component, OnInit} from "@angular/core";
import {Conference} from "../../model/conference";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {DataLoaderService} from "../../data-loader.service";
import {DBLPDataLoaderService} from "../../dblpdata-loader.service";
import {LocalDAOService} from "../../localdao.service";
import {Encoder} from "../../lib/encoder";

@Component({
    selector: 'app-organization',
    templateUrl: 'organization.component.html',
    styleUrls: ['organization.component.css'],
})
export class OrganizationComponent implements OnInit {
    private organization;
    private members = [];

    constructor(private router:Router,private route: ActivatedRoute,
                private DaoService: LocalDAOService,  private encoder: Encoder) {
        this.organization = {
            label: undefined,
        }

        this.members = [];
    }

    ngOnInit() {
        console.log("Init Organization Component");

        const that = this;
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            let name = params['name'];

            if(!id || !name){
                return false;
            }

            id = that.encoder.decode(id);
            if(!id)
            {
                return false;
            }

            console.log(id);
            let query = { 'key' : id };
            this.DaoService.query("getOrganization", query, (results) => {
                if(results){
                    const nodeLabel = results['?label'];
                    if(nodeLabel)
                    {
                        const label = nodeLabel.value;
                        if(!label)
                        {
                            return false;
                        }

                        that.organization.label = label;
                    }
                }
            });

            this.DaoService.query("getMemberPersonByOrganisation", query, (results) => {
                if(results){
                    const nodeIdPerson = results['?idPerson'];
                    const nodeName = results['?name'];

                    if(!nodeName || !nodeIdPerson)
                    {
                        return false;
                    }

                    let id = nodeIdPerson.value;
                    const name = nodeName.value;

                    if(!id || !name)
                    {
                        return false;
                    }

                    id = that.encoder.encode(id);
                    if(!id)
                    {
                        return false;
                    }

                    that.members.push({
                        id: id,
                        name: name,
                    });
                }
            });

            /*for(let i in this.organization.members){
                let query = { 'key' : this.organization.members[i] };
                this.members[i] = this.DaoService.query("getPersonLink",query);
            }*/

            console.log(this.organization);
        });
    }
}

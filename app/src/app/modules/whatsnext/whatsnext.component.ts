import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params}   from '@angular/router';
import {Location}              from '@angular/common';
import {LocalDAOService} from  '../../localdao.service';
import {routerTransition} from '../../app.router.animation';
import * as moment from 'moment';
import {Encoder} from "../../lib/encoder";

@Component({
    selector: 'whatsnext',
    templateUrl: 'whatsnext.component.html',
    styleUrls: ['whatsnext.component.scss'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class WhatsNextComponent implements OnInit {
    schedules;

    constructor(private location: Location,
                private route: ActivatedRoute,
                private DaoService: LocalDAOService,
                private encoder: Encoder) {
        this.schedules = [];
    }

    ngOnInit() {
        const that = this;
        this.DaoService.query("getWhatsNext", null, (results) => {
            if (results) {
                const nodeId = results['?id'];
                const nodeLabel = results['?label'];
                const nodeStartDate = results['?startDate'];
                const nodeEndDate = results['?endDate'];

                if (nodeId && nodeLabel && nodeStartDate && nodeEndDate) {
                    let id = nodeId.value;
                    const label = nodeLabel.value;
                    const startDate = nodeStartDate.value;
                    const endDate = nodeEndDate.value;

                    if (id && label && startDate && endDate) {
                        id = that.encoder.encode(id);
                        if (id) {

                            const momentStartDate = moment(startDate);
                            const momentEndDate = moment(endDate);

                            if (momentEndDate && momentStartDate) {
                                const duration = moment.duration(momentEndDate.diff(momentStartDate));

                                var hours = parseInt(duration.asHours());
                                var minutes = parseInt(duration.asMinutes()) - hours * 60;

                                let strDuration = "";
                                if (hours > 0) {
                                    strDuration = hours + " hours and ";
                                }
                                if (minutes > 0) {
                                    strDuration += minutes + " minutes";
                                }

                                that.schedules = that.schedules.concat({
                                    id: id,
                                    label: label,
                                    startDate: momentStartDate.format('LLLL'),
                                    duration: strDuration,
                                    dateForSort: momentStartDate.format()
                                });

                                /*that.schedules.sort((a, b) => {
                                    const momentA = moment(a.dateForSort);
                                    const momentB = moment(b.dateForSort);
                                    return momentA.isSameOrAfter(momentB) ? 1 : -1;
                                });*/
                            }
                        }
                    }
                }
            }
        });
        /*this.schedules = this.DaoService.query("getWhatsNext", null);
         for (let i in this.schedules) {
         this.schedules[i].startsAt = moment(this.schedules[i].startsAt).format('LLLL');
         this.schedules[i].endsAt = moment(this.schedules[i].endsAt).format('LLLL');
         this.schedules[i].duration = moment.duration(this.schedules[i].duration).humanize();
         }
         console.log(this.schedules);*/

    }
}

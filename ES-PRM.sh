curl 'https://d.la3-c2-chi.salesforceliveagent.com/chat/rest/Visitor/Availability?Availability.prefix=Visitor&Availability.ids=\[57312000000TNfE,57312000000TNfi,57312000000TNfd,57312000000TNfY,57312000000TNfT,57312000000TNfO,57312000000TNfJ\]&deployment_id=57212000000GpJp&org_id=00DA0000000abSm' -H "X-LIVEAGENT-API-VERSION: 37" -H "Content-Type: application/json" | python -mjson.tool > report.json
git add report.json
dt=$(date '+%d/%m/%Y %H:%M:%S');
git commit -m "updated on $dt"
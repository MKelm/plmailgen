<?php

$emailFrom = "{{ senderEmail }}";
$subject = "{{ subject }}";

{% for data in dataList %}
{% if data.email %}
mail("{{ data.email }}", $subject, "{{ data.text }}", "From:".$emailFrom);
{% else %}
/* not reachable by email:
  {{ data.address.name }},
  {{ data.address.addr.street }} {{ data.address.addr.number }},
  {{ data.address.city.code }} {{ data.address.city.name }},
  {{ data.address.tel }} */
{% endif %}
{% endfor %}
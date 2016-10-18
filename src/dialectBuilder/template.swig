{% for dialect in dialects -%}

Md.extend("dialects/{{dialect.name}}", function(require) {

    var DialectBuilder = require("dialect-builder");

    return new dialectBuilder()
        .setSyntax([
            {% for name in dialect.syntax %}

                "{{name}}" {% if !loop.last %},{% endif %}

            {%- endfor %}
        ])
        .build();

})

{%- endfor %}

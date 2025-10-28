{% macro mask_email(column_name) %}
  case
    when {{ var('pii_mask_enabled') }} = true
    then concat(
      substr({{ column_name }}, 1, 2),
      '***@',
      regexp_extract({{ column_name }}, r'@(.+)$')
    )
    else {{ column_name }}
  end
{% endmacro %}

{% macro mask_phone(column_name) %}
  case
    when {{ var('pii_mask_enabled') }} = true
    then concat('***-***-', substr({{ column_name }}, -4))
    else {{ column_name }}
  end
{% endmacro %}

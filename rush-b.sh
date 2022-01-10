#!/bin/bash

path=`dirname $0`

cd ${path}/assets

find . -name "index.*.js" | xargs sed -i "s#env_quotation_host#${QUOTATION_HOST}#g"
find . -name "index.*.js" | xargs sed -i "s#env_pods_host#${PODS_HOST}#g"
find . -name "index.*.js" | xargs sed -i "s#env_file_service_host#${FILE_SERVICE_HOST}#g"
    
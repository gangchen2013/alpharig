#! /bin/sh

# Use this script to create table and populate some sample data

# Create Rig table
aws dynamodb create-table --cli-input-json file://drilling-ddb.json --region cn-north-1
aws dynamodb wait table-exists --table-name DRILLRIG
echo "table created"

# CREATE THE ASSET GENERAL TABLE
# TO GET THE SECONDARY INDEX TO WORK, HAVE TO DEFINE THE INDEX KEY IN THE TABLE ATTRIBUTE
aws dynamodb create-table --cli-input-json file://drillingasset-ddb.json --region cn-north-1 --global-secondary-indexes IndexName=assetsByRigId,KeySchema=["{AttributeName=drillrigId,KeyType=HASH}"],Projection="{ProjectionType= ALL ,}",ProvisionedThroughput="{ReadCapacityUnits=5,WriteCapacityUnits=5}"
aws dynamodb wait table-exists --table-name DRILLRIGASSET
echo "table created"

# CREATE THE ASSET MAINTENANCE TABLE
aws dynamodb create-table --cli-input-json file://assetmaintenance-ddb.json --region cn-north-1
aws dynamodb wait table-exists --table-name ASSETMAINTENANCE
echo "table created"


# CREATE THE ASSET DIAGNOSIS TABLE
aws dynamodb create-table --cli-input-json file://assetdiagnosis-ddb.json --region cn-north-1
aws dynamodb wait table-exists --table-name ASSETDIAGNOSIS
echo "table created"


# CREATE ASSETPARTS TABLE
aws dynamodb create-table --cli-input-json file://assetparts-ddb.json --region cn-north-1
aws dynamodb wait table-exists --table-name ASSETPARTS
echo "table created"


# ADDING SAMPLE DATA
aws dynamodb batch-write-item --request-items file://drilling.json

aws dynamodb batch-write-item --request-items file://assets.json

aws dynamodb batch-write-item --request-items file://assetmaintenance.json

-include .env
export


DEPLOY_FLAG := graph deploy --product hosted-service 

DEPLOY_KEY := --deploy-key ${THEGRAPH_ACCESS_TOKEN}
NETWORK_STRATEGY1 := --network arbitrum-one --network-file config/strategy1.json
NETWORK_STRATEGY2 := --network mainnet --network-file config/strategy2.json
NETWORK_STRATEGY3 := --network mainnet --network-file config/strategy3.json
NETWORK_STRATEGY4 := --network mainnet --network-file config/strategy4.json

# Regenerate the files if new changed were made
generate:; graph codegen

# Building 
build1:; graph build $(NETWORK_STRATEGY1)
build2:; graph build $(NETWORK_STRATEGY2)
build3:; graph build $(NETWORK_STRATEGY3)
build4:; graph build $(NETWORK_STRATEGY4)

# Deploy to the hosted service
deploy1:; $(DEPLOY_FLAG) dollet000/strategy1 $(NETWORK_STRATEGY1) $(DEPLOY_KEY)
deploy2:; $(DEPLOY_FLAG) dollet000/strategy2 $(NETWORK_STRATEGY2) $(DEPLOY_KEY)
deploy3:; $(DEPLOY_FLAG) dollet000/strategy3 $(NETWORK_STRATEGY3) $(DEPLOY_KEY)
deploy4:; $(DEPLOY_FLAG) dollet000/strategy4 $(NETWORK_STRATEGY4) $(DEPLOY_KEY)
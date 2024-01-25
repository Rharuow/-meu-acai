# MICRO SERVICE TO ORDER

- The API it's a microservice of handle all requests about the order and have comunication with the main api service.

## TO DO:

- [ ] Kafka
  - [x] Add Kafka to the project
  - [x] Add mongoose to project
  - [x] CREATE ORDER
    - [x] create a consumer in the group 'createOrderRequest'
    - [x] create a producer to send response.
    - [x] handle the request to save the order in mongoDB
  - [x] DELETE ORDER
    - [x] create a consumer in the group 'deleteOrderRequest'
    - [x] subscribe this consumer in the topic 'deleteServiceOrder'
    - [x] the consumer will receive the id of the order to be deleted
    - [x] create a producer to send response and order deleted
  - [ ] GET ORDER
    - [ ] create a consumer in the group 'getOrderRequest'
    - [ ] subscribe this consumer in the topic 'getServiceOrder'
    - [ ] the consumer will receive the id of the order to be received
    - [ ] create a producer to send response and order received

# TIPS TO PROJECT:

1. running the following command, the types of proto buffer file are created

```bash
node_modules/.bin/proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=src/protoBufferTypes src/protos/*.proto
```

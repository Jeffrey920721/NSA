from kafka import KafkaProducer
from kafka import KafkaConsumer
import nexradaws
import sys
import tempfile
from datetime import datetime
import json

bootstrap_servers = ['localhost:9092']

consumer = KafkaConsumer(
    'messagehandler-dataretrieval',
     bootstrap_servers=bootstrap_servers,
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='group1',
     value_deserializer=lambda x: json.loads(x.decode('utf-8')))

conn = nexradaws.NexradAwsInterface()

try:
    for message in consumer:
        arr = message.value.split()
        years = arr[2]
        months = arr[1]
        days = arr[0]
        radars = arr[3]
        scans = conn.get_avail_scans(years, months, days, radars)

        templocation = tempfile.mkdtemp()
        results = conn.download(scans[0:2], templocation)
        print(results.success)
        data = []
        for scan in results.iter_success():
            print("{} volume scan time {}".format(scan.radar_id,scan.scan_time))
            data.append(scan.filepath)
        jsonObj = {"scans": data}

        print("{} downloads failed.".format(results.failed_count))

        producer = KafkaProducer()
        ack = producer.send('dataretrieval-postprocess', json.dumps(jsonObj).encode('utf-8'))
        producer = KafkaProducer(
            bootstrap_servers = bootstrap_servers,
            retries = 5,
            value_serializer=lambda m: json.dumps(m).encode('ascii'))

        metadata = ack.get()
        print(metadata.topic)
        print(metadata.partition)

except KeyboardInterrupt:
    sys.exit()
print('main')

if consumer is not None:
    consumer.close()
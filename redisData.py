# -*- coding: utf-8 -*-

# Import Python libs
from __future__ import absolute_import, print_function
import optparse
import pprint
import time
import os
import json

# Import Salt libs
import salt.utils.event

# Import 3rd-party libs
from salt.ext import six
import redis

def parse():
    '''
    Parse the script command line inputs
    '''
    parser = optparse.OptionParser()

    parser.add_option(
        '-s',
        '--sock-dir',
        dest='sock_dir',
        default='/var/run/salt',
        help=('Statically define the directory holding the salt unix '
              'sockets for communication')
    )
    parser.add_option(
        '-n',
        '--node',
        dest='node',
        default='master',
        help=('State if this listener will attach to a master or a '
              'minion daemon, pass "master" or "minion"')
    )
    parser.add_option(
        '-f',
        '--func_count',
        default='',
        help=('Return a count of the number of minions which have '
              'replied to a job with a given func.')
    )
    parser.add_option(
        '-i',
        '--id',
        default='',
        help=('If connecting to a live master or minion, pass in the id')
    )
    parser.add_option(
        '-t',
        '--transport',
        default='zeromq',
        help=('Transport to use. (Default: \'zeromq\'')
    )
    parser.add_option(
        '-r',
        '--redis-host',
        dest='redis_host',
        default='192.168.64.7',
        help='IP address of the Redis server'
    )
    parser.add_option(
        '-p',
        '--redis-port',
        dest='redis_port',
        default=6379,
        type='int',
        help='Port of the Redis server (default: 6379)'
    )

    options, args = parser.parse_args()

    opts = {}

    for k, v in six.iteritems(options.__dict__):
        if v is not None:
            opts[k] = v

    opts['sock_dir'] = os.path.join(opts['sock_dir'], opts['node'])

    if 'minion' in options.node:
        if args:
            opts['id'] = args[0]
            return opts
        if options.id:
            opts['id'] = options.id
        else:
            opts['id'] = options.node

    return opts


def check_access_and_print_warning(sock_dir):
    '''
    Check if this user is able to access the socket
    directory and print a warning if not
    '''
    if (os.access(sock_dir, os.R_OK) and
            os.access(sock_dir, os.W_OK) and
            os.access(sock_dir, os.X_OK)):
        return
    else:
        print('WARNING: Events will not be reported'
              ' (not able to access {0})'.format(sock_dir))

def send_event_to_redis(redis_conn, job_id, event_data):
    '''
    Send event data to Redis
    '''
    # Key for storing data in a Redis hash
    redis_key = job_id
    redis_conn.publish(redis_key,json.dumps(event_data))
    redis_conn.set(redis_key, json.dumps(event_data))
    print(f'Event for job {job_id} sent to Redis and published on channel.')

def listen(opts):
    '''
    Attach to the pub socket and grab messages
    '''
    event = salt.utils.event.get_event(
        opts['node'],
        sock_dir=opts['sock_dir'],
        transport=opts['transport'],
        opts=opts,
        listen=True
    )
    check_access_and_print_warning(opts['sock_dir'])
    jid_counter = 0
    found_minions = []

    redis_conn = redis.Redis(host=opts['redis_host'], port=opts['redis_port'])
    while True:
        ret = event.get_event(full=True)
        if ret is None:
            continue
        if opts['func_count']:
            data = ret.get('data', False)
            if data:
                if 'id' in six.iterkeys(data) and data.get('id', False) not in found_minions:
                    if data['fun'] == opts['func_count']:
                        jid_counter += 1
                        found_minions.append(data['id'])
                        print('Reply received from [{0}]. Total replies now: [{1}].'.format(ret['data']['id'], jid_counter))
                    continue
        else:
            data = json.loads(json.dumps(ret['data']))
            print("data", data)
            if 'id' in list(data.keys()) and data['id']  == ret['tag'].split('/')[-1]:
                job_id = ret['tag'].split('/')[-3]
                print("job id:", job_id)
                event_data = ret['data']
                print(event_data)
                send_event_to_redis(redis_conn, job_id, event_data)
            print('Event fired at {0}'.format(time.asctime()))


if __name__ == '__main__':
    opts = parse()
    listen(opts)



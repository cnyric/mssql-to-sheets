import status from 'http-status';

async function authenticate(req: any, res: any, next: any) {
  let token = req.headers['authorization'];

  if (!token || atob(token.replace('Bearer ', '')) !== process.env['TRANSACTION_KEY']) {
    res.statusCode = 401;
    return res.end(status[401]);
  }

  next();
}

export default authenticate;

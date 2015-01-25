describe('Backbone.SimpleAuth', function() {
  describe('when creating an instance of SimpleAuth', function() {
    describe('and there is no cookie set', function() {
      beforeEach(function() {
        stub(SimpleAuth.prototype, 'trigger');
        this.auth = new SimpleAuth();
      });

      it('should set `authenticated` as false', function() {
        expect(this.auth.get('authenticated')).to.equal(false);
      });

      it('should set `token` as undefined', function() {
        expect(this.auth.get('token')).to.be.undefined;
      });

      it('should not trigger any events', function() {
        expect(this.auth.trigger).to.not.have.beenCalled;
      });
    });

    describe('and there is a cookie named `token` set', function() {
      beforeEach(function() {
        cookies.set('token', 'asdf');
        stub(SimpleAuth.prototype, 'trigger');
        this.auth = new SimpleAuth();
      });

      afterEach(function() {
        cookies.expire('token');
      });

      it('should be set as authenticated', function() {
        expect(this.auth.get('authenticated')).to.equal(true);
      });

      it('should set the value of token', function() {
        expect(this.auth.get('token')).to.equal('asdf');
      });

      it('should trigger a change event for `authenticated`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:authenticated');
      });

      it('should trigger a change event for `token`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:token');
      });

      it('should trigger the authenticate event', function() {
        expect(this.auth.trigger).to.have.been.calledWith('authenticate', 'asdf');
      });
    });

    describe('and there is a cookie with another name set that auth is configured to look for', function() {
      beforeEach(function() {
        cookies.set('app-token', 'asdf');
        stub(SimpleAuth.prototype, 'trigger');
        this.auth = new SimpleAuth({
          cookieName: 'app-token'
        });
      });

      afterEach(function() {
        cookies.expire('app-token');
      });

      it('should be set as authenticated', function() {
        expect(this.auth.get('authenticated')).to.equal(true);
      });

      it('should have set the value of token', function() {
        expect(this.auth.get('token')).to.equal('asdf');
      });

      it('should trigger a change event for `authenticated`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:authenticated');
      });

      it('should trigger a change event for `token`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:token');
      });

      it('should trigger the authenticate event', function() {
        expect(this.auth.trigger).to.have.been.calledWithExactly('authenticate', 'asdf');
      });
    });

    describe('when logged in, then calling logout', function() {
      beforeEach(function() {
        cookies.set('token', 'asdf');
        stub(SimpleAuth.prototype, 'trigger');
        spy(SimpleAuth.prototype, 'logout');
        this.auth = new SimpleAuth();
        this.auth.logout();
      });

      afterEach(function() {
        cookies.expire('token');
      });

      it('should destroy the cookie', function() {
        expect(cookies.get('token')).to.be.undefined;
      });

      it('should trigger the logout event', function() {
        expect(this.auth.trigger).to.have.been.calledWithExactly('logout');
      });

      it('should set `authenticated` to be false', function() {
        expect(this.auth.get('authenticated')).to.be.false;
      });

      it('should set `token` to be undefined', function() {
        expect(this.auth.get('token')).to.be.undefined;
      });
    });

    describe('when logged out, and then logging in later', function() {
      beforeEach(function() {
        stub(SimpleAuth.prototype, 'trigger');
        spy(SimpleAuth.prototype, 'logout');
        this.auth = new SimpleAuth();
        cookies.set('token', 'asdf');
        this.auth.determineAuth();
      });

      afterEach(function() {
        cookies.expire('token');
      });

      it('should set `authenticated` as true', function() {
        expect(this.auth.get('authenticated')).to.equal(true);
      });

      it('should set the value of `token`', function() {
        expect(this.auth.get('token')).to.equal('asdf');
      });

      it('should trigger a change event for `authenticated`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:authenticated');
      });

      it('should trigger a change event for `token`', function() {
        expect(this.auth.trigger).to.have.been.calledWith('change:token');
      });

      it('should trigger the authenticate event', function() {
        expect(this.auth.trigger).to.have.been.calledWith('authenticate', 'asdf');
      });
    });

    describe('when making AJAX requests', function() {
      beforeEach(function() {
        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];
        this.xhr.onCreate = function (xhr) {
          requests.push(xhr);
        };
      });

      afterEach(function() {
        this.xhr.restore();
      });


      describe('and not authenticated', function() {
        beforeEach(function() {
          this.auth = new SimpleAuth();
          Backbone.$.get('https://www.google.com');
        });

        it('should not set the Authorization header', function() {
          expect(this.requests[0].requestHeaders.Authorization).to.be.undefined;
        });
      });

      describe('and authenticated', function() {
        beforeEach(function() {
          cookies.set('token', 'asdf');
          this.auth = new SimpleAuth();
          Backbone.$.get('https://www.google.com');
        });

        afterEach(function() {
          cookies.expire('token');
        });

        it('should not set the Authorization header', function() {
          expect(this.requests[0].requestHeaders.Authorization).to.equal('Bearer asdf');
        });
      });
    });
  });
});

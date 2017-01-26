.PHONY: deps clean test grunt

all: deps clean test grunt

deps:
	@npm install

clean:
	@rm -f *.rpm

test:
	@npm run test

grunt:
	@npm run grunt
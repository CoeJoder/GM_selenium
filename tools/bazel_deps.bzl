"""
Unlike WORKSPACE, the content of this file is unordered.
We keep them separate to make the WORKSPACE file more maintainable.
"""

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def fetch_dependencies():
    """Third-party dependencies fetched by Bazel"""

    # Install rules for software packaging
    # Transitive dependency of protobuf
    http_archive(
        name = "rules_pkg",
        sha256 = "8f9ee2dc10c1ae514ee599a8b42ed99fa262b757058f65ad3c384289ff70c4b8",
        urls = ["https://github.com/bazelbuild/rules_pkg/releases/download/0.9.1/rules_pkg-0.9.1.tar.gz"],
    )

    # Install the Bazel JavaScript toolchain
    http_archive(
		name = "rules_nodejs",
		sha256 = "162f4adfd719ba42b8a6f16030a20f434dc110c65dc608660ef7b3411c9873f9",
		strip_prefix = "rules_nodejs-6.0.2",
		url = "https://github.com/bazelbuild/rules_nodejs/releases/download/v6.0.2/rules_nodejs-v6.0.2.tar.gz",
	)

    # Install the selenium project
    # Provides browser automation functions ("atoms")
    http_archive(
        name = "selenium",
        sha256 = "8aae1c45d6d8a20dc876503913a9c39766c3c506dcd6d9e4b5bd519be2c20f3f",
        strip_prefix = "selenium-selenium-4.16.0",
        urls = ["https://github.com/SeleniumHQ/selenium/archive/selenium-4.16.0.tar.gz"],
    )

    # Install the Closure Rules for Bazel
    # Provides a build system for code which uses the Google Closure Library & Compiler
    http_archive(
        name = "io_bazel_rules_closure",
        sha256 = "9498e57368efb82b985db1ed426a767cbf1ba0398fd7aed632fc3908654e1b1e",
        strip_prefix = "rules_closure-0.12.0",
        urls = ["https://github.com/bazelbuild/rules_closure/archive/0.12.0.tar.gz"],
    )

    # Install transitive dependency required by @selenium
    RULES_JVM_EXTERNAL_TAG = "5.3"
    RULES_JVM_EXTERNAL_SHA ="d31e369b854322ca5098ea12c69d7175ded971435e55c18dd9dd5f29cc5249ac"
    http_archive(
        name = "rules_jvm_external",
        strip_prefix = "rules_jvm_external-%s" % RULES_JVM_EXTERNAL_TAG,
        sha256 = RULES_JVM_EXTERNAL_SHA,
        url = "https://github.com/bazelbuild/rules_jvm_external/releases/download/%s/rules_jvm_external-%s.tar.gz" % (RULES_JVM_EXTERNAL_TAG, RULES_JVM_EXTERNAL_TAG)
    )

    # Install transitive dependency required by @selenium
    http_archive(
        name = "contrib_rules_jvm",
        sha256 = "4d62589dc6a55e74bbe33930b826d593367fc777449a410604b2ad7c6c625ef7",
        strip_prefix = "rules_jvm-0.19.0",
        url = "https://github.com/bazel-contrib/rules_jvm/releases/download/v0.19.0/rules_jvm-v0.19.0.tar.gz",
    )

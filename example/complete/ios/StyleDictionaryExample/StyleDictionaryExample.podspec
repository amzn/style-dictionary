
Pod::Spec.new do |s|
  s.name             = 'StyleDictionaryExample'
  s.version          = '0.1.0'
  s.summary          = 'An example StyleDictionary cocoapod and example app.'

  s.description      = <<-DESC
An example StyleDictionary cocoapod and example app.
                       DESC

  s.homepage         = 'homepage'
  s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
  s.author           = { 'Danny Banks' => 'djb@amazon.com' }
  s.source           = { :git => '', :tag => s.version.to_s }

  s.ios.deployment_target = '10.2'

  s.source_files = 'StyleDictionaryExample/Classes/**/*.{h,m}'
  s.public_header_files = 'StyleDictionaryExample/Classes/**/*.h'
  s.resource_bundles = {
    'StyleDictionaryExample' => ['StyleDictionaryExample/assets/**/*']
  }

  s.frameworks = 'UIKit', 'QuartzCore'
end
